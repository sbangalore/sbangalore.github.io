#!/usr/bin/env python3
"""Sync live idea-registry verdicts into the markets maps.

For every market_structure row carrying a clean `registry_id`, fetch the
matching idea card from the consensus portal and stamp a compact `registry`
object (verdict, signal, rank_score, updated_at) onto the row. The maps stay
static JSON; this script is the freshness bridge.

Usage:
  CONSENSUS_PORTAL_URL=... CONSENSUS_PORTAL_API_TOKEN=... python3 scripts/sync_registry_to_maps.py
  # or rely on ~/Developer/consensus/.env being present

Run it whenever registry verdicts move, then commit the JSON diff.
"""
import json
import os
import pathlib
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1] / "markets" / "data"
MAPS = ["finance", "ai"]


def load_env_fallback():
    env_path = pathlib.Path.home() / "Developer" / "consensus" / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip().strip('"').strip("'")
        if key in ("CONSENSUS_PORTAL_URL", "CONSENSUS_PORTAL_API_TOKEN") and key not in os.environ:
            os.environ[key] = value


DEFAULT_PORTAL = "https://operator.octomil.com"


def fetch_ideas(base_url, token):
    last = "no endpoint attempted"
    for path in ("/api/v1/ideas?limit=500", "/api/ideas"):
        req = urllib.request.Request(
            base_url.rstrip("/") + path,
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
                "User-Agent": "markets-map-sync/1.0 (curl-compatible)",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
        except Exception as exc:  # noqa: BLE001 - try the next path
            last = f"{path}: {exc}"
            continue
        items = data if isinstance(data, list) else data.get("rows") or data.get("ideas") or data.get("items") or []
        if items:
            return {i["idea_id"]: i for i in items if isinstance(i, dict) and i.get("idea_id")}
    raise SystemExit(f"could not fetch ideas from portal ({last})")


def main():
    load_env_fallback()
    base_url = os.environ.get("CONSENSUS_PORTAL_URL") or DEFAULT_PORTAL
    token = os.environ.get("CONSENSUS_PORTAL_API_TOKEN")
    if not token:
        raise SystemExit("CONSENSUS_PORTAL_API_TOKEN not set (and no consensus/.env found)")
    ideas = fetch_ideas(base_url, token)
    print(f"registry: {len(ideas)} ideas fetched")
    touched = 0
    for m in MAPS:
        path = ROOT / m / "market_structure.json"
        doc = json.loads(path.read_text())
        for row in doc.get("markets", []):
            rid = row.get("registry_id")
            if not rid:
                continue
            idea = ideas.get(rid)
            if not idea:
                print(f"  WARN {m}/{row['key']}: registry_id '{rid}' not found in registry")
                continue
            row["registry"] = {
                "verdict": idea.get("verdict"),
                "signal": idea.get("signal"),
                "rank_score": idea.get("rank_score"),
                "updated_at": idea.get("updated_at"),
            }
            touched += 1
            print(f"  {m}/{row['key']} <- {rid}: {idea.get('verdict')} / rank {idea.get('rank_score')}")
        path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n")
    print(f"stamped {touched} rows")


if __name__ == "__main__":
    sys.exit(main())
