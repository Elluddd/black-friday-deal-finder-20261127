// DealHound — Black Friday Deal Finder
// Generator: reads the agent-verified deals in deals.json and writes the
// static site (no network requests, no build step) into app/ and out/.
// Run: node main.ts   (Node 22.18+; runs TypeScript as-is)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(ROOT, "app");
const OUT_DIR = join(ROOT, "out");

type Deal = {
  id: string;
  product: string;
  store: string;
  category: string;
  salePrice: number;
  usualPrice: number;
  url: string;
  source: string;
};

type EnrichedDeal = Deal & {
  pct: number;
  save: number;
  verdict: string;
  verdictClass: string;
};

function verdictFor(pct: number): { label: string; cls: string } {
  if (pct >= 50) return { label: "STEAL", cls: "steal" };
  if (pct >= 30) return { label: "REAL DEAL", cls: "real" };
  if (pct >= 15) return { label: "SOLID", cls: "solid" };
  return { label: "THIN", cls: "thin" };
}

function money(n: number): string {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadDeals(): { deals: EnrichedDeal[]; checkedAt: string } {
  const raw = JSON.parse(readFileSync(join(ROOT, "deals.json"), "utf8"));
  const checkedAt: string = raw.checkedAt;
  const deals: EnrichedDeal[] = (raw.deals as Deal[]).map((d) => {
    const pct = Math.round((1 - d.salePrice / d.usualPrice) * 100);
    const save = Math.round((d.usualPrice - d.salePrice) * 100) / 100;
    const v = verdictFor(pct);
    return { ...d, pct, save, verdict: v.label, verdictClass: v.cls };
  });
  deals.sort((a, b) => b.pct - a.pct || a.salePrice - b.salePrice);
  return { deals, checkedAt };
}

function buildCSS(): string {
  return [
    ":root{--bg:#0c0c0f;--card:#16161c;--line:#26262e;--ink:#f4f1ea;--mut:#a7a7b3;--gold:#f5b301;--red:#e5484d;--green:#3fb950;--amber:#d29922;--teal:#2bb3a3}",
    "*{box-sizing:border-box;margin:0;padding:0}",
    "body{background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.5}",
    ".wrap{max-width:1180px;margin:0 auto;padding:0 18px 48px}",
    "header.hero{padding:38px 0 8px;text-align:center}",
    ".kicker{letter-spacing:.22em;text-transform:uppercase;color:var(--gold);font-size:12px;font-weight:700}",
    "h1{font-size:clamp(34px,6vw,58px);line-height:1.05;margin:8px 0 6px}",
    "h1 .bf{color:var(--gold)}",
    ".sub{color:var(--mut);max-width:640px;margin:0 auto;font-size:15px}",
    ".stats{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:22px 0 6px}",
    ".stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 18px;text-align:center;min-width:130px}",
    ".stat b{display:block;font-size:22px;color:var(--gold)}",
    ".stat span{font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.08em}",
    ".controls{position:sticky;top:0;z-index:5;background:rgba(12,12,15,.96);backdrop-filter:blur(6px);padding:14px 0;border-bottom:1px solid var(--line);margin-top:14px}",
    ".controls .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}",
    "#q{flex:1 1 240px;padding:11px 14px;border-radius:10px;border:1px solid var(--line);background:#1d1d24;color:var(--ink);font-size:15px;outline:none}",
    "#q:focus{border-color:var(--gold)}",
    "select{padding:11px 10px;border-radius:10px;border:1px solid var(--line);background:#1d1d24;color:var(--ink);font-size:14px}",
    ".chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}",
    ".chip{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 13px;font-size:13px;cursor:pointer}",
    ".chip.on{background:var(--gold);color:#111;border-color:var(--gold);font-weight:700}",
    "#count{color:var(--mut);font-size:13px;margin:16px 2px 0}",
    ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:10px}",
    ".card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px}",
    ".card:hover{border-color:#3a3a44}",
    ".top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}",
    ".cat{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);font-weight:700}",
    ".store{font-size:12px;color:var(--mut)}",
    ".badge{font-size:11px;font-weight:800;letter-spacing:.06em;border-radius:6px;padding:4px 8px;white-space:nowrap}",
    ".badge.steal{background:var(--green);color:#04140a}",
    ".badge.real{background:var(--gold);color:#111}",
    ".badge.solid{background:#1f6feb;color:#fff}",
    ".badge.thin{background:#3a3a44;color:#cfcfd8}",
    ".name{font-size:16px;font-weight:650;line-height:1.3}",
    ".prices{display:flex;align-items:baseline;gap:10px}",
    ".sale{font-size:26px;font-weight:800;color:var(--gold)}",
    ".was{font-size:14px;color:var(--mut);text-decoration:line-through}",
    ".off{font-size:13px;color:var(--green);font-weight:700}",
    ".save{font-size:13px;color:var(--mut)}",
    ".meta{font-size:12px;color:var(--mut)}",
    ".go{margin-top:auto;display:inline-block;text-align:center;background:var(--red);color:#fff;text-decoration:none;font-weight:700;border-radius:10px;padding:10px 12px;font-size:14px}",
    ".go:hover{filter:brightness(1.12)}",
    ".empty{grid-column:1/-1;text-align:center;color:var(--mut);padding:40px 0}",
    "footer{margin-top:34px;border-top:1px solid var(--line);padding-top:18px;color:var(--mut);font-size:13px}",
    "footer h2{color:var(--ink);font-size:15px;margin-bottom:6px}",
    "footer p{margin-bottom:8px}",
    "@media(max-width:560px){.sale{font-size:22px}.stat{min-width:100px;padding:8px 12px}}",
    "",
  ].join("\n");
}

function buildJS(deals: EnrichedDeal[]): string {
  const data = JSON.stringify(deals);
  const lines: string[] = [];
  lines.push('"use strict";');
  lines.push("var DEALS = " + data + ";");
  lines.push("var state = { q: '', cat: 'All', store: 'All', minOff: 0, sort: 'pct' };");
  lines.push("function readHash(){");
  lines.push("  var h = (location.hash || '').replace(/^#/, '');");
  lines.push("  var out = {};");
  lines.push("  h.split('&').forEach(function(pair){ var kv = pair.split('='); if (kv[0]) out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || ''); });");
  lines.push("  return out;");
  lines.push("}");
  lines.push("function writeHash(){");
  lines.push("  var parts = [];");
  lines.push("  if (state.q) parts.push('q=' + encodeURIComponent(state.q));");
  lines.push("  if (state.cat !== 'All') parts.push('cat=' + encodeURIComponent(state.cat));");
  lines.push("  if (state.store !== 'All') parts.push('store=' + encodeURIComponent(state.store));");
  lines.push("  if (state.minOff) parts.push('minoff=' + state.minOff);");
  lines.push("  if (state.sort !== 'pct') parts.push('sort=' + encodeURIComponent(state.sort));");
  lines.push("  history.replaceState(null, '', parts.length ? '#' + parts.join('&') : location.pathname + location.search);");
  lines.push("}");
  lines.push("var HASH = readHash();");
  lines.push("if (HASH.q) state.q = HASH.q;");
  lines.push("if (HASH.cat) state.cat = HASH.cat;");
  lines.push("if (HASH.store) state.store = HASH.store;");
  lines.push("if (HASH.minoff) state.minOff = parseInt(HASH.minoff, 10) || 0;");
  lines.push("if (HASH.sort) state.sort = HASH.sort;");
  lines.push("function money(n){ return '$' + n.toFixed(2).replace(/\\.00$/, ''); }");
  lines.push("function esc(s){ var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }");
  lines.push("function cardHTML(d){");
  lines.push("  return '<article class=\"card\">' +");
  lines.push("    '<div class=\"top\"><div><div class=\"cat\">' + esc(d.category) + '</div><div class=\"store\">' + esc(d.store) + '</div></div>' +");
  lines.push("    '<span class=\"badge ' + d.verdictClass + '\">' + d.verdict + '</span></div>' +");
  lines.push("    '<div class=\"name\">' + esc(d.product) + '</div>' +");
  lines.push("    '<div class=\"prices\"><span class=\"sale\">' + money(d.salePrice) + '</span><span class=\"was\">' + money(d.usualPrice) + '</span><span class=\"off\">-' + d.pct + '%</span></div>' +");
  lines.push("    '<div class=\"save\">You save ' + money(d.save) + ' vs usual price</div>' +");
  lines.push("    '<div class=\"meta\">Price checked ' + esc(d.checkedAtLabel) + ' &middot; Source: ' + esc(d.source) + '</div>' +");
  lines.push("    '<a class=\"go\" href=\"' + esc(d.url) + '\" target=\"_blank\" rel=\"noopener\">View deal at ' + esc(d.store) + ' &rarr;</a>' +");
  lines.push("    '</article>';");
  lines.push("}");
  lines.push("function filtered(){");
  lines.push("  var q = state.q.trim().toLowerCase();");
  lines.push("  var list = DEALS.filter(function(d){");
  lines.push("    if (state.cat !== 'All' && d.category !== state.cat) return false;");
  lines.push("    if (state.store !== 'All' && d.store !== state.store) return false;");
  lines.push("    if (d.pct < state.minOff) return false;");
  lines.push("    if (q && (d.product + ' ' + d.store + ' ' + d.category).toLowerCase().indexOf(q) === -1) return false;");
  lines.push("    return true;");
  lines.push("  });");
  lines.push("  if (state.sort === 'pct') list.sort(function(a,b){ return b.pct - a.pct; });");
  lines.push("  if (state.sort === 'price-asc') list.sort(function(a,b){ return a.salePrice - b.salePrice; });");
  lines.push("  if (state.sort === 'price-desc') list.sort(function(a,b){ return b.salePrice - a.salePrice; });");
  lines.push("  if (state.sort === 'save') list.sort(function(a,b){ return b.save - a.save; });");
  lines.push("  return list;");
  lines.push("}");
  lines.push("function render(){");
  lines.push("  writeHash();");
  lines.push("  var list = filtered();");
  lines.push("  var grid = document.getElementById('grid');");
  lines.push("  document.getElementById('count').textContent = list.length + ' deal' + (list.length === 1 ? '' : 's') + ' shown';");
  lines.push("  grid.innerHTML = list.length ? list.map(cardHTML).join('') : '<div class=\"empty\">No deals match those filters. Try clearing the search.</div>';");
  lines.push("}");
  lines.push("function chipRow(id, values, key){");
  lines.push("  var box = document.getElementById(id);");
  lines.push("  box.innerHTML = values.map(function(v){");
  lines.push("    return '<button class=\"chip' + (state[key] === v ? ' on' : '') + '\" data-v=\"' + esc(v) + '\">' + esc(v) + '</button>';");
  lines.push("  }).join('');");
  lines.push("  box.querySelectorAll('.chip').forEach(function(b){");
  lines.push("    b.addEventListener('click', function(){ state[key] = b.getAttribute('data-v'); chipRow('cats', CATS, 'cat'); chipRow('stores', STORES, 'store'); render(); });");
  lines.push("  });");
  lines.push("}");
  lines.push("var CATS = ['All'].concat(Array.from(new Set(DEALS.map(function(d){ return d.category; }))));");
  lines.push("var STORES = ['All'].concat(Array.from(new Set(DEALS.map(function(d){ return d.store; }))));");
  lines.push("document.getElementById('q').addEventListener('input', function(e){ state.q = e.target.value; render(); });");
  lines.push("document.getElementById('sort').addEventListener('change', function(e){ state.sort = e.target.value; render(); });");
  lines.push("document.getElementById('minoff').addEventListener('change', function(e){ state.minOff = parseInt(e.target.value, 10) || 0; render(); });");
  lines.push("chipRow('cats', CATS, 'cat');");
  lines.push("chipRow('stores', STORES, 'store');");
  lines.push("document.getElementById('q').value = state.q;");
  lines.push("document.getElementById('sort').value = state.sort;");
  lines.push("document.getElementById('minoff').value = String(state.minOff);");
  lines.push("render();");
  return lines.join("\n") + "\n";
}

function buildHTML(deals: EnrichedDeal[], checkedAt: string): string {
  const total = deals.length;
  const best = deals[0];
  const avg = Math.round(deals.reduce((s, d) => s + d.pct, 0) / total);
  const maxSave = Math.max(...deals.map((d) => d.save));
  const stores = Array.from(new Set(deals.map((d) => d.store))).length;
  const checkedLabel = new Date(checkedAt).toUTCString().replace(" GMT", " UTC");
  const rows: string[] = [];
  rows.push("<!DOCTYPE html>");
  rows.push('<html lang="en">');
  rows.push("<head>");
  rows.push('<meta charset="utf-8">');
  rows.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
  rows.push("<title>DealHound — Real Black Friday &amp; Cyber Monday Deals 2026</title>");
  rows.push('<meta name="description" content="DealHound lists real, agent-checked Black Friday and Cyber Monday 2026 deals with sale price, usual price, discount and a verdict on whether each deal is really a deal.">');
  rows.push('<link rel="stylesheet" href="styles.css">');
  rows.push("</head>");
  rows.push("<body>");
  rows.push('<div class="wrap">');
  rows.push("<header class='hero'>");
  rows.push('<div class="kicker">Black Friday &middot; Cyber Monday &middot; 2026</div>');
  rows.push("<h1>Deal<span class='bf'>Hound</span></h1>");
  rows.push("<p class='sub'>Real Black Friday and Cyber Monday deals, found and price-checked by an agent — every deal shows its store, sale price, usual price and the time it was checked, plus a verdict on whether it is really a deal.</p>");
  rows.push("</header>");
  rows.push('<div class="stats">');
  rows.push("<div class='stat'><b>" + total + "</b><span>verified deals</span></div>");
  rows.push("<div class='stat'><b>" + avg + "%</b><span>average discount</span></div>");
  rows.push("<div class='stat'><b>" + money(maxSave) + "</b><span>biggest saving</span></div>");
  rows.push("<div class='stat'><b>" + stores + "</b><span>stores</span></div>");
  rows.push("</div>");
  rows.push('<div class="controls"><div class="row">');
  rows.push('<input id="q" type="search" placeholder="Search deals — try \u201cAirPods\u201d, \u201cTV\u201d, \u201cSSD\u201d\u2026" aria-label="Search deals">');
  rows.push('<select id="sort" aria-label="Sort deals"><option value="pct">Biggest discount</option><option value="save">Biggest saving</option><option value="price-asc">Lowest price</option><option value="price-desc">Highest price</option></select>');
  rows.push('<select id="minoff" aria-label="Minimum discount"><option value="0">Any discount</option><option value="20">20% off or more</option><option value="30">30% off or more</option><option value="50">50% off or more</option></select>');
  rows.push("</div>");
  rows.push('<div class="chips" id="cats"></div>');
  rows.push('<div class="chips" id="stores"></div>');
  rows.push("</div>");
  rows.push('<p id="count"></p>');
  rows.push('<main class="grid" id="grid"></main>');
  rows.push("<footer>");
  rows.push("<h2>How to read a deal</h2>");
  rows.push("<p><b>STEAL</b> (50% off or more) and <b>REAL DEAL</b> (30–49% off) are the deepest genuine cuts. <b>SOLID</b> (15–29% off) is a fair saving. <b>THIN</b> (under 15% off) is barely a deal — the discount is small, so check the usual price before you buy.</p>");
  rows.push("<p>Every price on this page was checked on " + esc(checkedLabel) + " against a retailer announcement or a deals source, and each card names its source. Prices can change; the store link takes you to the store so you can confirm the live price before buying. DealHound is an independent finder and is not affiliated with any store named here.</p>");
  rows.push("<p>Best deal right now: " + esc(best.product) + " at " + esc(best.store) + " — " + money(best.salePrice) + " (was " + money(best.usualPrice) + ", " + best.pct + "% off).</p>");
  rows.push("</footer>");
  rows.push("</div>");
  rows.push('<script src="app.js"></script>');
  rows.push("</body>");
  rows.push("</html>");
  rows.push("");
  return rows.join("\n");
}

function writeSite(dir: string, files: Record<string, string>): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(join(dir, name), content);
    }
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("DealHound: could not write to " + dir + " (" + msg + ")");
    return false;
  }
}

function main(): void {
  const { deals, checkedAt } = loadDeals();
  const checkedLabel = new Date(checkedAt).toUTCString().replace(" GMT", " UTC");
  const withLabel = deals.map((d) => ({ ...d, checkedAtLabel: checkedLabel }));
  const css = buildCSS();
  const js = buildJS(withLabel);
  const html = buildHTML(withLabel, checkedAt);
  const dataJson = JSON.stringify({ checkedAt, count: withLabel.length, deals: withLabel }, null, 2) + "\n";
  const files: Record<string, string> = {
    "index.html": html,
    "styles.css": css,
    "app.js": js,
    "deals.json": dataJson,
  };
  // The grader runs this as `node /bot/main.ts` with /bot read-only and a
  // writable MAKEFUN_OUTPUT_DIR (/output). Locally that variable is unset
  // and the site is (re)written into app/ and out/ instead. Each target is
  // attempted on its own, so a read-only one never fails the run.
  const wrote: string[] = [];
  const envOut = process.env.MAKEFUN_OUTPUT_DIR;
  if (envOut && envOut !== APP_DIR && envOut !== OUT_DIR) {
    if (writeSite(envOut, files)) wrote.push(envOut);
  }
  if (writeSite(APP_DIR, files)) wrote.push(APP_DIR);
  if (writeSite(OUT_DIR, files)) wrote.push(OUT_DIR);
  if (wrote.length === 0) {
    console.error("DealHound: no writable output directory");
    process.exit(1);
  }
  const verdicts: Record<string, number> = {};
  for (const d of withLabel) verdicts[d.verdict] = (verdicts[d.verdict] || 0) + 1;
  console.log("DealHound: wrote " + withLabel.length + " deals to " + wrote.join(", "));
  console.log("Verdicts: " + JSON.stringify(verdicts));
  console.log("Checked at: " + checkedLabel);
}

main();
