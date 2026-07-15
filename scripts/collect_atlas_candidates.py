#!/usr/bin/env python3
"""Collect review candidates without modifying public atlas claims."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "markets" / "sources.json"
INBOX_PATH = ROOT / ".atlas" / "candidate_inbox.json"
USER_AGENT = "sbangalore-markets-atlas/1.0 (https://sbangalore.github.io/markets/)"


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _get(url: str, *, accept: str = "application/json") -> bytes:
    headers = {"User-Agent": USER_AGENT, "Accept": accept}
    if "api.github.com" in url and os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"
        headers["X-GitHub-Api-Version"] = "2022-11-28"
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
        return response.read()


def _date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
    except ValueError:
        try:
            from email.utils import parsedate_to_datetime
            return parsedate_to_datetime(value).astimezone(timezone.utc)
        except (TypeError, ValueError):
            return None


def _feed_items(source: dict[str, Any]) -> list[dict[str, Any]]:
    document = _get(source["endpoint"], accept="application/rss+xml, application/atom+xml, application/xml").decode("utf-8", "replace")
    rows: list[dict[str, Any]] = []
    for item in re.findall(r"<item\b[^>]*>(.*?)</item>", document, flags=re.I | re.S):
        def value(tag: str) -> str:
            match = re.search(rf"<{tag}\b[^>]*>(.*?)</{tag}>", item, flags=re.I | re.S)
            if not match:
                return ""
            text = re.sub(r"<!\[CDATA\[(.*?)\]\]>", r"\1", match.group(1), flags=re.S)
            return html.unescape(re.sub(r"<[^>]+>", " ", text)).strip()
        rows.append({
            "title": value("title"),
            "url": value("link"),
            "published_at": value("pubDate"),
            "summary": value("description"),
        })
    return rows


def _openalex_items(source: dict[str, Any], since: datetime) -> list[dict[str, Any]]:
    params = {
        "search": source["query"],
        "filter": f"from_publication_date:{since.date().isoformat()},is_retracted:false",
        "sort": "publication_date:desc",
        "per-page": "25",
        "select": "id,display_name,publication_date,doi,primary_location,authorships,topics",
    }
    body = json.loads(_get(source["endpoint"] + "?" + urllib.parse.urlencode(params)))
    rows = []
    for item in body.get("results", []):
        location = item.get("primary_location") or {}
        rows.append({
            "title": item.get("display_name") or "",
            "url": item.get("doi") or location.get("landing_page_url") or item.get("id") or "",
            "published_at": item.get("publication_date") or "",
            "summary": " ".join(topic.get("display_name", "") for topic in item.get("topics", [])[:5]),
            "authors": [a.get("author", {}).get("display_name") for a in item.get("authorships", [])[:5] if a.get("author")],
        })
    return rows


def _github_items(source: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for item in json.loads(_get(source["endpoint"] + "?per_page=20")):
        if item.get("draft") or item.get("prerelease"):
            continue
        if re.fullmatch(r"b\d+", str(item.get("name") or item.get("tag_name") or ""), flags=re.I):
            continue
        rows.append({
            "title": item.get("name") or item.get("tag_name") or "Release",
            "url": item.get("html_url") or "",
            "published_at": item.get("published_at") or "",
            "summary": (item.get("body") or "")[:2000],
        })
    return rows


def validate_registry(registry: dict[str, Any]) -> None:
    required = {"id", "name", "lane", "kind", "source_class", "authority", "promotion_policy", "endpoint", "homepage"}
    ids: set[str] = set()
    for source in registry.get("sources", []):
        missing = required - source.keys()
        if missing:
            raise ValueError(f"{source.get('id', 'source')} missing: {sorted(missing)}")
        if source["id"] in ids:
            raise ValueError(f"duplicate source id: {source['id']}")
        ids.add(source["id"])
        if source["promotion_policy"] == "discovery_only" and source["authority"] != "lead_only":
            raise ValueError(f"{source['id']} discovery-only sources must be lead-only")


def collect(registry: dict[str, Any], now: datetime) -> dict[str, Any]:
    policy = registry["policy"]
    since = now - timedelta(days=int(policy["freshness_days"]))
    candidates: list[dict[str, Any]] = []
    source_runs: list[dict[str, Any]] = []
    for source in registry["sources"]:
        if source["kind"] == "external_discovery":
            source_runs.append({"source_id": source["id"], "status": "external", "candidate_count": 0})
            continue
        try:
            if source["kind"] == "feed":
                rows = _feed_items(source)
            elif source["kind"] == "openalex":
                rows = _openalex_items(source, since)
            elif source["kind"] == "github_releases":
                rows = _github_items(source)
            else:
                raise ValueError(f"unsupported source kind: {source['kind']}")
            lane = registry["lanes"][source["lane"]]
            accepted = []
            for row in rows:
                published = _date(row.get("published_at"))
                if published and published < since:
                    continue
                haystack = row.get("title", "") if source["kind"] == "feed" else f"{row.get('title', '')} {row.get('summary', '')}"
                haystack = haystack.lower()
                matches = [term for term in lane["keywords"] if term.lower() in haystack]
                minimum_matches = 2 if source["source_class"] == "research_index" else 1
                if len(matches) < minimum_matches:
                    continue
                url = row.get("url") or source["homepage"]
                key = hashlib.sha256(f"{source['id']}|{url}|{row.get('title', '')}".encode()).hexdigest()[:16]
                accepted.append({
                    "candidate_id": f"atlas-{key}",
                    "lane": source["lane"],
                    "title": row.get("title", "").strip(),
                    "url": url,
                    "published_at": published.isoformat() if published else None,
                    "source_id": source["id"],
                    "source_name": source["name"],
                    "source_class": source["source_class"],
                    "authority": source["authority"],
                    "promotion_policy": source["promotion_policy"],
                    "matched_terms": matches,
                    "proposed_targets": lane["targets"],
                    "review_status": "unreviewed",
                })
            limit = int(policy["max_candidates_per_source"])
            candidates.extend(accepted[:limit])
            source_runs.append({"source_id": source["id"], "status": "ok", "candidate_count": min(len(accepted), limit)})
        except Exception as exc:  # one source must not suppress the full inbox
            source_runs.append({"source_id": source["id"], "status": "error", "candidate_count": 0, "error": f"{type(exc).__name__}: {exc}"[:240]})
    candidates.sort(key=lambda item: (item.get("published_at") or "", item["authority"] == "primary"), reverse=True)
    return {
        "schema_version": 1,
        "generated_at": now.isoformat(),
        "publication_rule": policy["publication_rule"],
        "candidate_count": len(candidates),
        "source_runs": source_runs,
        "candidates": candidates,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    registry = _read_json(REGISTRY_PATH)
    validate_registry(registry)
    if args.validate_only:
        print(f"validated {len(registry['sources'])} atlas sources")
        return 0
    inbox = collect(registry, datetime.now(timezone.utc))
    if args.dry_run:
        print(json.dumps(inbox, indent=2, sort_keys=True))
        return 0
    INBOX_PATH.parent.mkdir(parents=True, exist_ok=True)
    INBOX_PATH.write_text(json.dumps(inbox, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"wrote {inbox['candidate_count']} candidates to {INBOX_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
