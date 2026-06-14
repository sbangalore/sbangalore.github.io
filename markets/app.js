const MAPS = {
  ai: {
    key: "ai",
    label: "AI Infrastructure",
    kicker: "AI infrastructure stack",
    title: "AI infra map",
    lede: "A map of compute, models, data/context, agent runtimes, serving, evaluation, security, and application infrastructure.",
    assetLabel: "Workloads",
    assetSingular: "Workload",
    assetCopy: "Which AI application or deployment pattern the product touches.",
    coverageLabel: "Workload coverage",
    verticalLabel: "Verticals",
    verticalSingular: "Vertical",
    verticalCopy: "Which buyer market or industrial constraint this touches.",
    verticalCoverageLabel: "Vertical-facing slice",
    stackLabel: "Open source",
    stackFilterLabel: "Open source only",
    stackPredicate: (entry) => (entry.access || []).includes("open_source"),
    primaryFlow: ["Supply flow", "Hardware to apps"],
    secondaryFlow: ["Control flow", "Context to governance"],
    literatureTitle: "Research feed and paper-to-product lineage",
    unbuiltLabel: "Open opportunities",
    unbuiltTitle: "Infrastructure gaps that have not hardened into default products yet",
    unbuiltCountLabel: "gaps",
    paths: {
      taxonomy: "./data/ai/taxonomy.json",
      entries: "./data/ai/entries.json",
      unbuilt: "./data/ai/unbuilt.json",
      literature: "./data/ai/literature.json",
      marketStructure: "./data/ai/market_structure.json",
    },
  },
  finance: {
    key: "finance",
    label: "Financial Markets",
    kicker: "Secondary-market structure",
    title: "Markets directory",
    lede: "A map of venues, brokers, data rails, analytics, asset managers, and post-trade plumbing across traditional, crypto, and event markets.",
    assetLabel: "Asset classes",
    assetSingular: "Asset class",
    assetCopy: "Which instruments or markets the product touches.",
    coverageLabel: "Asset-class coverage",
    verticalLabel: "",
    verticalSingular: "",
    verticalCopy: "",
    verticalCoverageLabel: "",
    stackLabel: "In our stack",
    stackFilterLabel: "Only in our stack",
    stackPredicate: (entry) => Boolean(entry.in_our_stack),
    primaryFlow: ["Capital flow", "Down the stack"],
    secondaryFlow: ["Data flow", "Up the stack"],
    literatureTitle: "New ideas and paper-to-product lineage",
    unbuiltLabel: "Unbuilt markets",
    unbuiltTitle: "Literature-predicted markets still looking for a natural short",
    unbuiltCountLabel: "ideas",
    paths: {
      taxonomy: "./data/finance/taxonomy.json",
      entries: "./data/finance/entries.json",
      unbuilt: "./data/finance/unbuilt.json",
      literature: "./data/finance/literature.json",
      marketStructure: "./data/finance/market_structure.json",
    },
  },
};

const state = {
  map: "ai",
  view: "overview",
  query: "",
  stackOnly: false,
  sort: "segment",
  filters: {
    segment: new Set(),
    layer: new Set(),
    asset: new Set(),
    vertical: new Set(),
    region: new Set(),
    cost: new Set(),
    status: new Set(),
    mechanism: new Set(),
    adapter: new Set(),
  },
};

let taxonomy = {};
let entries = [];
let unbuilt = { items: [] };
let literature = { sources: [], recent_signals: [] };
let marketStructure = { markets: [] };
let lookup = {};

const $ = (id) => document.getElementById(id);
const activeMap = () => MAPS[state.map] || MAPS.ai;

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}: ${response.status}`);
  return response.json();
}

function buildLookup() {
  const listLookup = (name) => new Map((taxonomy[name] || []).map((item) => [item.key, item]));
  lookup = {
    segment: listLookup("segments"),
    layer: listLookup("layers"),
    asset: listLookup("asset_classes"),
    region: listLookup("regions"),
    cost: listLookup("cost_tiers"),
    status: listLookup("statuses"),
    access: listLookup("access"),
    depth: listLookup("data_depth"),
    vertical: listLookup("verticals"),
    mechanism: listLookup("market_mechanisms"),
    adapter: listLookup("adapter_shapes"),
  };
}

function itemLabel(kind, key) {
  return lookup[kind]?.get(key)?.label || key;
}

function segmentColor(key) {
  return lookup.segment.get(key)?.color || "#7dd3fc";
}

const countryNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryLabel(code) {
  if (!code) return "";
  const upper = String(code).toUpperCase();
  try {
    return countryNames?.of(upper) || upper;
  } catch {
    return upper;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  state.map = MAPS[params.get("map")] ? params.get("map") : "ai";
  state.view = ["overview", "matrix", "directory", "research"].includes(params.get("view")) ? params.get("view") : "overview";
  state.query = params.get("q") || "";
  state.stackOnly = params.get("stack") === "1";
  state.sort = params.get("sort") || "segment";
  for (const facet of Object.keys(state.filters)) {
    state.filters[facet] = new Set((params.get(facet) || "").split(",").filter(Boolean));
  }
}

function writeUrlState() {
  const params = new URLSearchParams();
  if (state.map !== "ai") params.set("map", state.map);
  if (state.view !== "overview") params.set("view", state.view);
  if (state.query) params.set("q", state.query);
  if (state.stackOnly) params.set("stack", "1");
  if (state.sort !== "segment") params.set("sort", state.sort);
  for (const [facet, values] of Object.entries(state.filters)) {
    if (facet === "vertical" && !taxonomy.verticals?.length) continue;
    if (facet === "mechanism" && !taxonomy.market_mechanisms?.length) continue;
    if (facet === "adapter" && !taxonomy.adapter_shapes?.length) continue;
    if (values.size) params.set(facet, [...values].join(","));
  }
  const query = params.toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

function setView(view) {
  state.view = ["overview", "matrix", "directory", "research"].includes(view) ? view : "overview";
}

function textBlob(entry) {
  return [
    entry.name,
    entry.blurb,
    entry.country,
    countryLabel(entry.country),
    entry.origin,
    entry.notes,
    ...(entry.market_mechanisms || []).map((key) => itemLabel("mechanism", key)),
    ...(entry.adapter_shapes || []).map((key) => itemLabel("adapter", key)),
    ...(entry.tags || []),
    ...(entry.notable || []),
    ...entryVerticals(entry).map((key) => itemLabel("vertical", key)),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const aiVerticalFallback = {
  chat: ["consumer", "enterprise_ops"],
  coding: ["software_engineering"],
  rag_search: ["enterprise_ops"],
  agents: ["enterprise_ops"],
  voice: ["customer_ops"],
  audio: ["creative_media"],
  vision: ["robotics_manufacturing", "healthcare_bio", "simulation_autonomy"],
  video: ["creative_media"],
  robotics: ["robotics_embodied", "robotics_manufacturing"],
  science_bio: ["healthcare_bio"],
  creative: ["creative_media"],
  on_device: ["consumer", "edge_device"],
  enterprise_automation: ["enterprise_ops"],
  multi_modal: ["enterprise_ops", "consumer"],
  multi_workload: ["multi_vertical"],
};

function entryVerticals(entry) {
  if (!taxonomy.verticals?.length) return [];
  if (entry.verticals?.length) return entry.verticals;
  const derived = new Set();
  for (const asset of entry.asset_classes || []) {
    for (const vertical of aiVerticalFallback[asset] || []) derived.add(vertical);
  }
  return [...derived];
}

function intersects(values = [], selected) {
  return selected.size === 0 || values.some((value) => selected.has(value));
}

function entryMatches(entry) {
  if (state.query && !textBlob(entry).includes(state.query.toLowerCase())) return false;
  if (state.stackOnly && !activeMap().stackPredicate(entry)) return false;
  if (state.filters.segment.size && !state.filters.segment.has(entry.segment)) return false;
  if (!intersects(entry.layers, state.filters.layer)) return false;
  if (!intersects(entry.asset_classes, state.filters.asset)) return false;
  if (taxonomy.verticals?.length && !intersects(entryVerticals(entry), state.filters.vertical)) return false;
  if (state.filters.region.size && !state.filters.region.has(entry.region)) return false;
  if (state.filters.cost.size && !state.filters.cost.has(entry.cost_tier)) return false;
  if (state.filters.status.size && !state.filters.status.has(entry.status || "active")) return false;
  if (taxonomy.market_mechanisms?.length && !intersects(entry.market_mechanisms, state.filters.mechanism)) return false;
  if (taxonomy.adapter_shapes?.length && !intersects(entry.adapter_shapes, state.filters.adapter)) return false;
  return true;
}

function filteredEntries() {
  return entries.filter(entryMatches);
}

function matrixEntries() {
  return entries.filter((entry) => {
    if (state.query && !textBlob(entry).includes(state.query.toLowerCase())) return false;
    if (state.stackOnly && !activeMap().stackPredicate(entry)) return false;
    if (!intersects(entry.asset_classes, state.filters.asset)) return false;
    if (taxonomy.verticals?.length && !intersects(entryVerticals(entry), state.filters.vertical)) return false;
    if (state.filters.region.size && !state.filters.region.has(entry.region)) return false;
    if (state.filters.cost.size && !state.filters.cost.has(entry.cost_tier)) return false;
    if (state.filters.status.size && !state.filters.status.has(entry.status || "active")) return false;
    if (taxonomy.market_mechanisms?.length && !intersects(entry.market_mechanisms, state.filters.mechanism)) return false;
    if (taxonomy.adapter_shapes?.length && !intersects(entry.adapter_shapes, state.filters.adapter)) return false;
    return true;
  });
}

function renderStats() {
  const config = activeMap();
  $("statEntries").textContent = entries.length;
  $("statSegments").textContent = taxonomy.segments.length;
  $("statAssets").textContent = taxonomy.asset_classes.length;
  $("statStack").textContent = entries.filter(config.stackPredicate).length;
  $("statAssetsLabel").textContent = config.assetLabel;
  $("statStackLabel").textContent = config.stackLabel;
}

function renderMapChrome() {
  const config = activeMap();
  document.title = `${config.label} - Infrastructure Atlas`;
  document.body.dataset.view = state.view;
  document.body.dataset.map = state.map;
  $("mapKicker").textContent = config.kicker;
  $("mapTitle").textContent = config.title;
  $("mapLede").textContent = config.lede;
  $("assetLegendLabel").textContent = config.assetSingular;
  $("assetLegendCopy").textContent = config.assetCopy;
  $("verticalLegend").hidden = !taxonomy.verticals?.length;
  $("verticalLegendLabel").textContent = config.verticalSingular || "Vertical";
  $("verticalLegendCopy").textContent = config.verticalCopy || "";
  $("primaryFlowLabel").textContent = config.primaryFlow[0];
  $("primaryFlowSub").textContent = config.primaryFlow[1];
  $("secondaryFlowLabel").textContent = config.secondaryFlow[0];
  $("secondaryFlowSub").textContent = config.secondaryFlow[1];
  $("coverageHeading").textContent = config.coverageLabel;
  $("stackOnlyText").textContent = config.stackFilterLabel;
  $("literatureTitle").textContent = config.literatureTitle;
  $("unbuiltLabel").textContent = config.unbuiltLabel;
  $("unbuiltTitle").textContent = config.unbuiltTitle;
  $("mapSwitcher").innerHTML = Object.values(MAPS)
    .map(
      (item) => `
        <button class="${item.key === state.map ? "is-active" : ""}" type="button" data-map-key="${item.key}">
          ${escapeHtml(item.label)}
        </button>
      `,
    )
    .join("");
  $("viewSwitcher").querySelectorAll("[data-view-key]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewKey === state.view);
  });
  updateViewVisibility();
}

function updateViewVisibility() {
  document.querySelectorAll("[data-view-section]").forEach((section) => {
    const views = (section.dataset.viewSection || "").split(" ");
    const available =
      (section.id !== "verticalMaturityShell" || Boolean(taxonomy.verticals?.length)) &&
      (section.id !== "marketStructureShell" || Boolean((marketStructure.markets || []).length));
    section.hidden = !available || !views.includes(state.view);
  });
}

function renderFlowLegend() {
  const flows = taxonomy.legend_flows || {};
  const chip = (key) => {
    const segment = lookup.segment.get(key);
    if (!segment) return "";
    return `<span class="flow-chip" style="--chip:${segment.color}">${escapeHtml(segment.label)}</span>`;
  };
  $("capitalFlowRoot").innerHTML = (flows.capital_chain || []).map(chip).join('<span class="flow-arrow">-></span>');
  $("dataFlowRoot").innerHTML = (flows.data_chain || []).map(chip).join('<span class="flow-arrow">-></span>');
  $("flowScopeNote").textContent = flows.scope_note || flows.description || "";
}

function facetConfigs() {
  const config = activeMap();
  return [
    { key: "segment", title: "Segment", items: taxonomy.segments, entryKey: "segment" },
    { key: "layer", title: "Layer", items: taxonomy.layers, entryKey: "layers" },
    { key: "asset", title: config.assetSingular, items: taxonomy.asset_classes, entryKey: "asset_classes" },
    ...(taxonomy.verticals?.length ? [{ key: "vertical", title: config.verticalSingular, items: taxonomy.verticals, entryKey: "verticals" }] : []),
    ...(taxonomy.market_mechanisms?.length ? [{ key: "mechanism", title: "Mechanism", items: taxonomy.market_mechanisms, entryKey: "market_mechanisms" }] : []),
    ...(taxonomy.adapter_shapes?.length ? [{ key: "adapter", title: "Adapter shape", items: taxonomy.adapter_shapes, entryKey: "adapter_shapes" }] : []),
    { key: "region", title: "Region", items: taxonomy.regions, entryKey: "region" },
    { key: "cost", title: "Cost", items: taxonomy.cost_tiers, entryKey: "cost_tier" },
    { key: "status", title: "Status", items: taxonomy.statuses, entryKey: "status" },
  ];
}

function countForFacet(config, itemKey) {
  if (config.key === "vertical") return entries.filter((entry) => entryVerticals(entry).includes(itemKey)).length;
  return entries.filter((entry) => {
    const value = entry[config.entryKey] || (config.key === "status" ? "active" : undefined);
    return Array.isArray(value) ? value.includes(itemKey) : value === itemKey;
  }).length;
}

function renderFacets() {
  $("facetRoot").innerHTML = facetConfigs()
    .map((config) => {
      const options = config.items
        .map((item) => {
          const active = state.filters[config.key].has(item.key);
          const color = config.key === "segment" ? ` style="--facet:${item.color}"` : "";
          return `
            <button class="facet-option ${active ? "is-active" : ""}" data-facet="${config.key}" data-key="${item.key}" type="button"${color}>
              <span>${escapeHtml(item.label)}</span>
              <small>${countForFacet(config, item.key)}</small>
            </button>
          `;
        })
        .join("");
      return `
        <section class="facet" data-facet="${config.key}">
          <h3>${escapeHtml(config.title)}</h3>
          <div class="facet__options">${options}</div>
        </section>
      `;
    })
    .join("");
}

function matrixCellInfo(layerKey, segmentKey, count) {
  const cells = taxonomy.matrix_cells || {};
  const key = `${layerKey}|${segmentKey}`;
  const structural = new Map((cells.structural || []).map((cell) => [`${cell.layer}|${cell.segment}`, cell]));
  const opportunity = new Map((cells.opportunity || []).map((cell) => [`${cell.layer}|${cell.segment}`, cell]));
  const structCell = structural.get(key);
  const oppCell = opportunity.get(key);
  if (count > 0) return { className: `cell lit ${oppCell ? "flagged" : ""}`, text: count, note: oppCell?.note };
  if (structCell) return { className: "cell structural", text: "x", note: structCell.reason };
  if (oppCell) return { className: "cell open flagged", text: "0", note: oppCell.note };
  return { className: "cell open", text: "0", note: "No curated entry in this cell yet." };
}

function renderMatrix() {
  const cols = taxonomy.segments.length;
  const counts = new Map();
  const list = matrixEntries();
  $("matrixActiveFilters").innerHTML = activeFilterHtml() || `<span>${list.length} entries in matrix</span>`;
  for (const entry of list) {
    for (const layer of entry.layers || []) {
      const key = `${layer}|${entry.segment}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const header = `
    <div class="matrix-corner"></div>
    ${taxonomy.segments
      .map((segment) => `<div class="matrix-seg" title="${escapeHtml(segment.description || "")}" style="--seg:${segment.color}">${escapeHtml(segment.label)}</div>`)
      .join("")}
  `;
  const rows = taxonomy.layers
    .map((layer) => {
      const cells = taxonomy.segments
        .map((segment) => {
          const count = counts.get(`${layer.key}|${segment.key}`) || 0;
          const info = matrixCellInfo(layer.key, segment.key, count);
          const title = `${layer.label} / ${segment.label}: ${info.note || count}`;
          if (info.className.includes("structural")) {
            return `<div class="${info.className}" title="${escapeHtml(title)}">${escapeHtml(info.text)}</div>`;
          }
          return `<button class="${info.className}" title="${escapeHtml(title)}" data-matrix-segment="${segment.key}" data-matrix-layer="${layer.key}" type="button" style="--seg:${segment.color}">${escapeHtml(info.text)}</button>`;
        })
        .join("");
      return `<div class="matrix-layer" title="${escapeHtml(layer.description || "")}">${escapeHtml(layer.label)}</div>${cells}`;
    })
    .join("");
  $("matrixRoot").style.setProperty("--matrix-columns", cols);
  $("matrixRoot").innerHTML = header + rows;
}

function renderAssetRail() {
  const counts = new Map();
  for (const entry of entries) {
    for (const asset of entry.asset_classes || []) counts.set(asset, (counts.get(asset) || 0) + 1);
  }
  $("matrixAssetRoot").innerHTML = taxonomy.asset_classes
    .map((asset) => {
      const count = counts.get(asset.key) || 0;
      const active = state.filters.asset.has(asset.key);
      return `
        <button class="asset-pill ${active ? "is-active" : ""}" type="button" data-asset="${asset.key}">
          <span>${escapeHtml(asset.label)}</span>
          <strong>${count}</strong>
        </button>
      `;
    })
    .join("");
}

function renderVerticalRail() {
  const root = $("matrixVerticalRoot");
  const rail = $("verticalRail");
  if (!taxonomy.verticals?.length) {
    rail.hidden = true;
    root.innerHTML = "";
    return;
  }
  rail.hidden = false;
  $("verticalHeading").textContent = activeMap().verticalCoverageLabel || "Vertical-facing slice";
  const counts = new Map();
  for (const entry of entries) {
    for (const vertical of entryVerticals(entry)) counts.set(vertical, (counts.get(vertical) || 0) + 1);
  }
  root.innerHTML = taxonomy.verticals
    .map((vertical) => {
      const count = counts.get(vertical.key) || 0;
      const active = state.filters.vertical.has(vertical.key);
      return `
        <button class="asset-pill vertical-pill ${active ? "is-active" : ""}" type="button" data-vertical="${vertical.key}" title="${escapeHtml(vertical.description || "")}">
          <span>${escapeHtml(vertical.label)}</span>
          <strong>${count}</strong>
        </button>
      `;
    })
    .join("");
}

function verticalRows(verticalKey) {
  return entries.filter((entry) => entryVerticals(entry).includes(verticalKey));
}

function verticalComponents(rows) {
  const hasLayer = (key) => rows.some((entry) => (entry.layers || []).includes(key));
  const hasSegment = (...keys) => rows.some((entry) => keys.includes(entry.segment));
  return {
    infra: hasLayer("industrial_inputs") || hasLayer("physical_compute") || hasSegment("compute_hardware", "cloud_platforms", "datacenter_power", "semiconductor_supply", "industrial_materials"),
    models: hasLayer("model_supply") || hasSegment("model_labs", "open_model_ops"),
    data: hasLayer("data_context") || hasSegment("data_context", "retrieval_memory"),
    runtime: hasLayer("orchestration_runtime") || hasLayer("serving_inference") || hasSegment("orchestration_agents", "serving_inference"),
    apps: hasLayer("application_layer") || hasSegment("app_infra"),
    control: hasLayer("eval_observability") || hasLayer("ops_governance") || hasSegment("eval_observability", "security_governance"),
  };
}

function maturityStage(rows, components, layerCount, segmentCount) {
  const componentCount = Object.values(components).filter(Boolean).length;
  if (!rows.length) return { key: "unmapped", label: "Unmapped", rank: 0 };
  if (!components.apps && components.infra) return { key: "supply", label: "Supply-side", rank: 1 };
  if (rows.length >= 18 && layerCount >= 7 && segmentCount >= 6 && componentCount >= 5) return { key: "mature", label: "Mature", rank: 4 };
  if (rows.length >= 8 && layerCount >= 5 && componentCount >= 4) return { key: "forming", label: "Stack-forming", rank: 3 };
  if (rows.length >= 3 && components.apps) return { key: "app", label: "App-led", rank: 2 };
  return { key: "nascent", label: "Nascent", rank: 1 };
}

function renderVerticalMaturity() {
  const shell = $("verticalMaturityShell");
  const grid = $("verticalMaturityGrid");
  if (!taxonomy.verticals?.length) {
    shell.hidden = true;
    grid.innerHTML = "";
    return;
  }
  shell.hidden = false;
  $("verticalMaturityLegend").innerHTML = ["Mature", "Stack-forming", "App-led", "Nascent", "Supply-side"]
    .map((label) => `<span>${escapeHtml(label)}</span>`)
    .join("");
  const componentLabels = {
    infra: "Infra",
    models: "Models",
    data: "Data",
    runtime: "Runtime",
    apps: "Apps",
    control: "Control",
  };
  let rows = taxonomy.verticals
    .map((vertical) => {
      const verticalEntries = verticalRows(vertical.key);
      const layers = new Set(verticalEntries.flatMap((entry) => entry.layers || []));
      const segments = new Set(verticalEntries.map((entry) => entry.segment));
      const components = verticalComponents(verticalEntries);
      const componentCount = Object.values(components).filter(Boolean).length;
      const stage = maturityStage(verticalEntries, components, layers.size, segments.size);
      return { vertical, verticalEntries, layers, segments, components, componentCount, stage };
    })
    .sort((a, b) => b.stage.rank - a.stage.rank || b.verticalEntries.length - a.verticalEntries.length || a.vertical.label.localeCompare(b.vertical.label));
  grid.innerHTML = rows
    .map(
      (item) => `
        <button class="maturity-card maturity-card--${item.stage.key} ${state.filters.vertical.has(item.vertical.key) ? "is-active" : ""}" type="button" data-vertical="${item.vertical.key}">
          <span class="maturity-card__stage">${escapeHtml(item.stage.label)}</span>
          <strong>${escapeHtml(item.vertical.label)}</strong>
          <span class="maturity-card__metrics">${item.verticalEntries.length} entries · ${item.layers.size} layers · ${item.segments.size} segments</span>
          <span class="maturity-card__components" aria-label="${item.componentCount} of 6 stack components covered">
            ${Object.entries(componentLabels)
              .map(([key, label]) => `<i class="${item.components[key] ? "is-covered" : ""}" title="${escapeHtml(label)}">${escapeHtml(label)}</i>`)
              .join("")}
          </span>
        </button>
      `,
    )
    .join("");
}

function marketMatchesState(market) {
  const mapsTo = market.maps_to || {};
  if (state.filters.segment.size && !state.filters.segment.has(mapsTo.segment)) return false;
  if (state.filters.layer.size && !intersects(mapsTo.layers || [], state.filters.layer)) return false;
  if (state.filters.asset.size && !intersects(mapsTo.asset_classes || mapsTo.assets || [], state.filters.asset)) return false;
  if (taxonomy.verticals?.length && state.filters.vertical.size && !intersects(mapsTo.verticals || [], state.filters.vertical)) return false;
  if (state.query) {
    const blob = [
      market.name,
      market.stage,
      market.summary,
      market.read,
      market.profit_wedge,
      ...(market.examples || []),
      ...(mapsTo.verticals || []).map((key) => itemLabel("vertical", key)),
      mapsTo.segment ? itemLabel("segment", mapsTo.segment) : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!blob.includes(state.query.toLowerCase())) return false;
  }
  return true;
}

function scoreClass(score, invert = false) {
  const value = Number(score || 0);
  const high = invert ? value <= 2 : value >= 4;
  const mid = invert ? value === 3 : value === 3;
  if (high) return "is-good";
  if (mid) return "is-mid";
  return "is-hard";
}

function renderScore(label, value, invert = false) {
  return `
    <div class="structure-score ${scoreClass(value, invert)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderMarketStructure() {
  const shell = $("marketStructureShell");
  const grid = $("marketStructureGrid");
  const markets = marketStructure.markets || [];
  if (!markets.length) {
    shell.hidden = true;
    grid.innerHTML = "";
    return;
  }
  shell.hidden = false;
  $("marketStructureDescription").textContent = marketStructure.description || "";
  const filtered = markets.filter(marketMatchesState);
  const visible = filtered
    .sort((a, b) => (b.attractiveness || 0) - (a.attractiveness || 0) || a.name.localeCompare(b.name))
    .slice(0, state.view === "overview" ? 6 : filtered.length);
  $("marketStructureCount").textContent = state.view === "overview" && filtered.length > visible.length ? `${visible.length} of ${filtered.length} markets` : `${filtered.length} markets`;
  grid.innerHTML = visible
    .map((market) => {
      const mapsTo = market.maps_to || {};
      const examples = (market.examples || []).slice(0, 5).map((item) => badge(item, "badge--muted")).join("");
      const tags = [
        mapsTo.segment ? badge(itemLabel("segment", mapsTo.segment)) : "",
        ...(mapsTo.layers || []).slice(0, 2).map((key) => badge(itemLabel("layer", key))),
        ...(mapsTo.verticals || []).slice(0, 2).map((key) => badge(itemLabel("vertical", key), "badge--vertical")),
        ...(mapsTo.asset_classes || mapsTo.assets || []).slice(0, 2).map((key) => badge(itemLabel("asset", key))),
      ].join("");
      return `
        <article class="market-card">
          <div class="market-card__head">
            <span>${escapeHtml(market.stage || "stage unknown")}</span>
            <strong>${escapeHtml(market.name)}</strong>
          </div>
          <p>${escapeHtml(market.summary || "")}</p>
          <div class="structure-score-grid">
            ${renderScore("Attract", market.attractiveness)}
            ${renderScore("Growth", market.growth)}
            ${renderScore("Crowding", market.competition, true)}
            ${renderScore("Resources", market.resource_intensity, true)}
            ${renderScore("Distribution", market.distribution_difficulty, true)}
            ${renderScore("TAM/winner", market.tam_per_winner)}
          </div>
          ${market.profit_wedge ? `<p class="market-card__wedge">${escapeHtml(market.profit_wedge)}</p>` : ""}
          ${tags ? `<div class="badge-row">${tags}</div>` : ""}
          ${examples ? `<div class="badge-row market-card__examples">${examples}</div>` : ""}
        </article>
      `;
    })
    .join("");
}

function badge(text, className = "") {
  return `<span class="badge ${className}">${escapeHtml(text)}</span>`;
}

function renderEntryCard(entry) {
  const segment = lookup.segment.get(entry.segment);
  const layers = (entry.layers || []).slice(0, 2).map((key) => badge(itemLabel("layer", key))).join("");
  const assets = (entry.asset_classes || []).slice(0, 3).map((key) => badge(itemLabel("asset", key))).join("");
  const mechanisms = (entry.market_mechanisms || []).slice(0, 2).map((key) => badge(itemLabel("mechanism", key))).join("");
  const verticals = entryVerticals(entry).slice(0, 2).map((key) => badge(itemLabel("vertical", key), "badge--vertical")).join("");
  const country = entry.country ? `<span title="${escapeHtml(countryLabel(entry.country))}">HQ ${escapeHtml(entry.country)}</span>` : "";
  return `
    <article class="entry-card" style="--seg:${segment?.color || "#7dd3fc"}">
      <button class="entry-card__button" type="button" data-entry-id="${entry.id}">
        <span class="entry-card__segment">${escapeHtml(segment?.label || entry.segment)}</span>
        <strong>${escapeHtml(entry.name)}</strong>
        <p>${escapeHtml(entry.blurb)}</p>
        <div class="badge-row">${layers}${assets}${mechanisms}${verticals}</div>
        <div class="entry-card__meta">
          <span>${escapeHtml(itemLabel("region", entry.region))}</span>
          ${country}
          <span>${escapeHtml(itemLabel("cost", entry.cost_tier || "enterprise"))}</span>
          ${activeMap().stackPredicate(entry) ? `<span>${escapeHtml(activeMap().stackLabel)}</span>` : ""}
        </div>
      </button>
    </article>
  `;
}

function sortEntries(list) {
  const copy = [...list];
  if (state.sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (state.sort === "founded") return copy.sort((a, b) => (a.founded || 9999) - (b.founded || 9999));
  if (state.sort === "cost") {
    const order = { free: 0, freemium: 1, paid: 2, enterprise: 3 };
    return copy.sort((a, b) => (order[a.cost_tier] ?? 9) - (order[b.cost_tier] ?? 9) || a.name.localeCompare(b.name));
  }
  return copy.sort((a, b) => {
    const s = itemLabel("segment", a.segment).localeCompare(itemLabel("segment", b.segment));
    return s || a.name.localeCompare(b.name);
  });
}

function activeFilterHtml() {
  const chips = [];
  if (state.query) chips.push({ label: `Search: ${state.query}`, facet: "query" });
  if (state.stackOnly) chips.push({ label: activeMap().stackLabel, facet: "stack" });
  for (const [facet, values] of Object.entries(state.filters)) {
    if (facet === "vertical" && !taxonomy.verticals?.length) continue;
    if (facet === "mechanism" && !taxonomy.market_mechanisms?.length) continue;
    if (facet === "adapter" && !taxonomy.adapter_shapes?.length) continue;
    for (const value of values) {
      const kind = facet === "cost" ? "cost" : facet;
      chips.push({ label: itemLabel(kind, value), facet, value });
    }
  }
  return chips
    .map((chip) => `<button type="button" data-clear-facet="${chip.facet}" data-clear-value="${chip.value || ""}">${escapeHtml(chip.label)} <span>×</span></button>`)
    .join("");
}

function renderDirectory() {
  const list = sortEntries(filteredEntries());
  $("resultTitle").textContent = `${list.length} ${list.length === 1 ? "entry" : "entries"}`;
  $("activeFilters").innerHTML = activeFilterHtml();
  if (!list.length) {
    $("cardGrid").innerHTML = `<div class="empty-state">No entries match these filters.</div>`;
    return;
  }
  if (state.sort !== "segment") {
    $("cardGrid").innerHTML = list.map(renderEntryCard).join("");
    return;
  }
  $("cardGrid").innerHTML = taxonomy.segments
    .map((segment) => {
      const group = list.filter((entry) => entry.segment === segment.key);
      if (!group.length) return "";
      return `
        <section class="segment-group">
          <div class="segment-group__title" style="--seg:${segment.color}">
            <h3>${escapeHtml(segment.label)}</h3>
            <span>${group.length}</span>
          </div>
          <div class="segment-group__grid">${group.map(renderEntryCard).join("")}</div>
        </section>
      `;
    })
    .join("");
}

function renderLineage(lineage = []) {
  if (!lineage.length) return "";
  return `
    <section class="detail-section">
      <h3>Paper-to-product lineage</h3>
      <div class="lineage-list">
        ${lineage
          .map(
            (item) => `
              <div>
                <strong>${escapeHtml(item.year)} · ${escapeHtml(item.author || item.authors)}</strong>
                <p>${escapeHtml(item.work || item.title)}</p>
                <small>${escapeHtml([item.venue, item.note].filter(Boolean).join(" - "))}</small>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function openDetail(id) {
  const entry = entries.find((item) => item.id === id);
  if (!entry) return;
  const segment = lookup.segment.get(entry.segment);
  $("detailRoot").innerHTML = `
    <div class="detail-hero" style="--seg:${segment?.color || "#7dd3fc"}">
      <span>${escapeHtml(segment?.label || entry.segment)}</span>
      <h2>${escapeHtml(entry.name)}</h2>
      <p>${escapeHtml(entry.blurb)}</p>
      <a href="${escapeHtml(entry.url)}" target="_blank" rel="noreferrer">Open source</a>
    </div>
    <section class="detail-section">
      <h3>Map position</h3>
      <div class="badge-row">
        ${(entry.layers || []).map((key) => badge(itemLabel("layer", key))).join("")}
        ${(entry.asset_classes || []).map((key) => badge(itemLabel("asset", key))).join("")}
        ${(entry.market_mechanisms || []).map((key) => badge(itemLabel("mechanism", key))).join("")}
        ${(entry.adapter_shapes || []).map((key) => badge(itemLabel("adapter", key))).join("")}
        ${entryVerticals(entry).map((key) => badge(itemLabel("vertical", key), "badge--vertical")).join("")}
        ${badge(itemLabel("region", entry.region))}
        ${entry.country ? badge(`HQ ${entry.country}`) : ""}
        ${entry.cost_tier ? badge(itemLabel("cost", entry.cost_tier)) : ""}
        ${entry.status ? badge(itemLabel("status", entry.status)) : ""}
      </div>
    </section>
    ${
      entry.origin || entry.notes
        ? `<section class="detail-section"><h3>Notes</h3><p>${escapeHtml([entry.origin, entry.notes].filter(Boolean).join(" "))}</p></section>`
        : ""
    }
    ${
      entry.notable?.length
        ? `<section class="detail-section"><h3>Notable</h3><ul>${entry.notable.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`
        : ""
    }
    ${renderLineage(entry.lineage)}
  `;
  $("detailDialog").showModal();
}

function collectLiterature() {
  const recent = (literature.recent_signals || []).map((item) => ({
    type: "Recent signal",
    year: item.year,
    title: item.title,
    authors: item.authors,
    venue: item.venue,
    url: item.url,
    note: item.signal,
    implication: item.map_implication,
  }));
  const ghostRefs = (unbuilt.items || []).flatMap((item) =>
    (item.literature || []).map((ref) => ({
      type: "Open gap reference",
      year: ref.year,
      title: ref.work,
      authors: ref.author,
      venue: ref.venue || item.name,
      note: item.wall,
      implication: `Maps to ${itemLabel("segment", item.maps_to?.segment)}.`,
    })),
  );
  const lineage = entries.flatMap((entry) =>
    (entry.lineage || []).map((ref) => ({
      type: "Built lineage",
      year: ref.year,
      title: ref.work || ref.title,
      authors: ref.author || ref.authors,
      venue: ref.venue || entry.name,
      note: ref.note,
      implication: `Product: ${entry.name}.`,
    })),
  );
  return [...recent, ...ghostRefs, ...lineage].sort((a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title));
}

function renderLiterature() {
  const papers = collectLiterature();
  $("literatureDescription").textContent = literature.description || "";
  $("literatureCount").textContent = `${papers.length} signals`;
  $("literatureSources").innerHTML = (literature.sources || [])
    .map(
      (source) => `
        <a class="source-card" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
          <strong>${escapeHtml(source.name)}</strong>
          <span>${escapeHtml(source.type)}</span>
          <small>${escapeHtml((source.focus || []).join(" / "))}</small>
        </a>
      `,
    )
    .join("");
  $("literatureFeed").innerHTML = papers
    .map(
      (paper) => `
        <article class="paper-card">
          <div>
            <span>${escapeHtml(paper.type)}</span>
            <strong>${escapeHtml(paper.year || "n.d.")}</strong>
          </div>
          <h3>${paper.url ? `<a href="${escapeHtml(paper.url)}" target="_blank" rel="noreferrer">${escapeHtml(paper.title)}</a>` : escapeHtml(paper.title)}</h3>
          <p>${escapeHtml(paper.authors || "")}</p>
          <small>${escapeHtml(paper.venue || "")}</small>
          ${paper.note ? `<p>${escapeHtml(paper.note)}</p>` : ""}
          ${paper.implication ? `<em>${escapeHtml(paper.implication)}</em>` : ""}
        </article>
      `,
    )
    .join("");
}

function renderUnbuilt() {
  const items = unbuilt.items || [];
  $("unbuiltDescription").textContent = unbuilt.description || "";
  $("unbuiltCount").textContent = `${items.length} ${activeMap().unbuiltCountLabel}`;
  const visible = state.view === "overview" ? items.slice(0, 4) : items;
  $("unbuiltGrid").innerHTML = visible
    .map((item) => {
      const refs = (item.literature || [])
        .map((ref) => `<li>${escapeHtml(ref.author)} (${escapeHtml(ref.year)}), <em>${escapeHtml(ref.work)}</em>${ref.venue ? `, ${escapeHtml(ref.venue)}` : ""}</li>`)
        .join("");
      const liveLinks =
        item.id === "policy-analysis-market"
          ? `<div class="built-links"><span>Fulfilled by</span><button data-entry-id="kalshi" type="button">Kalshi</button><button data-entry-id="polymarket" type="button">Polymarket</button></div>`
          : "";
      return `
        <article class="unbuilt-card">
          <div class="unbuilt-card__top">
            <span class="status-badge">${escapeHtml(item.status)}</span>
            <strong>${escapeHtml(item.name)}</strong>
          </div>
          <p>${escapeHtml(item.blurb)}</p>
          <ul>${refs}</ul>
          <dl>
            <dt>Nearest attempt</dt><dd>${escapeHtml(item.nearest_attempts)}</dd>
            <dt>Wall</dt><dd>${escapeHtml(item.wall)}</dd>
            <dt>Unlock</dt><dd>${escapeHtml(item.unlock)}</dd>
          </dl>
          ${liveLinks}
        </article>
      `;
    })
    .join("");
}

function renderAll() {
  renderMapChrome();
  renderStats();
  renderFlowLegend();
  renderFacets();
  renderMatrix();
  renderAssetRail();
  renderVerticalRail();
  renderVerticalMaturity();
  renderMarketStructure();
  renderDirectory();
  renderLiterature();
  renderUnbuilt();
  updateViewVisibility();
  $("searchInput").value = state.query;
  $("stackOnly").checked = state.stackOnly;
  $("sortSelect").value = state.sort;
}

function rerenderWithUrl() {
  writeUrlState();
  renderAll();
}

function toggleSet(set, key) {
  if (set.has(key)) set.delete(key);
  else set.add(key);
}

function bindEvents() {
  $("mapSwitcher").addEventListener("click", (event) => {
    const button = event.target.closest("[data-map-key]");
    if (!button || button.dataset.mapKey === state.map) return;
    state.map = button.dataset.mapKey;
    state.view = "overview";
    state.query = "";
    state.stackOnly = false;
    state.sort = "segment";
    for (const key of Object.keys(state.filters)) state.filters[key].clear();
    loadActiveDataset()
      .then(() => {
        writeUrlState();
        renderAll();
      })
      .catch((error) => {
        console.error(error);
        document.body.innerHTML = `<main class="fatal"><h1>Could not load the map</h1><p>${escapeHtml(error.message)}</p></main>`;
      });
  });
  $("viewSwitcher").addEventListener("click", (event) => {
    const button = event.target.closest("[data-view-key]");
    if (!button || button.dataset.viewKey === state.view) return;
    setView(button.dataset.viewKey);
    rerenderWithUrl();
  });
  $("searchInput").addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    state.view = "directory";
    rerenderWithUrl();
  });
  $("stackOnly").addEventListener("change", (event) => {
    state.stackOnly = event.target.checked;
    rerenderWithUrl();
  });
  $("sortSelect").addEventListener("change", (event) => {
    state.sort = event.target.value;
    rerenderWithUrl();
  });
  $("clearFilters").addEventListener("click", () => {
    state.query = "";
    state.stackOnly = false;
    state.sort = "segment";
    for (const key of Object.keys(state.filters)) state.filters[key].clear();
    rerenderWithUrl();
  });
  document.body.addEventListener("click", (event) => {
    const facetButton = event.target.closest("[data-facet][data-key]");
    if (facetButton) {
      toggleSet(state.filters[facetButton.dataset.facet], facetButton.dataset.key);
      state.view = "directory";
      rerenderWithUrl();
      return;
    }
    const matrixButton = event.target.closest("[data-matrix-segment]");
    if (matrixButton) {
      state.filters.segment = new Set([matrixButton.dataset.matrixSegment]);
      state.filters.layer = new Set([matrixButton.dataset.matrixLayer]);
      state.view = "directory";
      rerenderWithUrl();
      document.querySelector(".directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const assetButton = event.target.closest("[data-asset]");
    if (assetButton) {
      toggleSet(state.filters.asset, assetButton.dataset.asset);
      state.view = "directory";
      rerenderWithUrl();
      return;
    }
    const verticalButton = event.target.closest("[data-vertical]");
    if (verticalButton) {
      toggleSet(state.filters.vertical, verticalButton.dataset.vertical);
      state.view = "directory";
      rerenderWithUrl();
      return;
    }
    const clearButton = event.target.closest("[data-clear-facet]");
    if (clearButton) {
      const facet = clearButton.dataset.clearFacet;
      const value = clearButton.dataset.clearValue;
      if (facet === "query") state.query = "";
      else if (facet === "stack") state.stackOnly = false;
      else state.filters[facet].delete(value);
      rerenderWithUrl();
      return;
    }
    const entryButton = event.target.closest("[data-entry-id]");
    if (entryButton) openDetail(entryButton.dataset.entryId);
  });
  $("closeDialog").addEventListener("click", () => $("detailDialog").close());
  $("detailDialog").addEventListener("click", (event) => {
    if (event.target === $("detailDialog")) $("detailDialog").close();
  });
}

async function loadActiveDataset() {
  const paths = activeMap().paths;
  [taxonomy, entries, unbuilt, literature, marketStructure] = await Promise.all([
    loadJson(paths.taxonomy),
    loadJson(paths.entries),
    loadJson(paths.unbuilt),
    loadJson(paths.literature),
    loadJson(paths.marketStructure),
  ]);
  buildLookup();
}

async function init() {
  try {
    readUrlState();
    await loadActiveDataset();
    bindEvents();
    renderAll();
  } catch (error) {
    console.error(error);
    document.body.innerHTML = `<main class="fatal"><h1>Could not load the map</h1><p>${escapeHtml(error.message)}</p></main>`;
  }
}

init();
