/*
 * Loads live content from Supabase (table `content`) into window.CATALOG, then starts app.js.
 * Rows: { kind: 'brand' | 'category' | 'product' | 'guide' | 'about' | 'settings', id, sort, data }.
 * Once the admin has imported the catalog (a `settings` row exists), Supabase is the source of truth:
 * anything deleted in the admin disappears here. Without Supabase, or if it is unreachable,
 * the built-in catalog is used.
 */
(function () {
  'use strict';
  var cfg = window.PG_CONFIG || {}, C = window.CATALOG;
  var started = false;
  function boot() {
    if (started) return; started = true;
    var s = document.createElement('script'); s.src = 'assets/js/app.js'; document.body.appendChild(s);
  }
  if (!C || !cfg.supabaseUrl || !cfg.supabaseKey || !window.fetch) { boot(); return; }

  var timer = setTimeout(boot, 6000); // never leave the page blank
  fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1/content?select=kind,id,sort,data&order=sort.asc,id.asc&limit=10000', {
    headers: { apikey: cfg.supabaseKey, Authorization: 'Bearer ' + cfg.supabaseKey }
  }).then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
    if (started) return;
    var settings = null, by = { brand: [], category: [], product: [], guide: [], about: [] };
    (rows || []).forEach(function (r) {
      var d = r.data || {};
      if (r.kind === 'settings') { settings = d; return; }
      if (!by[r.kind]) return;
      if (d.id == null) d.id = r.id;
      by[r.kind].push(d);
    });
    if (!settings) return; // catalog not imported yet: keep the built-in one
    var keepTint = C.TINT;
    C.SETTINGS = settings;
    C.BRANDS = by.brand; C.CATEGORIES = by.category; C.PRODUCTS = by.product; C.GUIDE = by.guide; C.ABOUT = by.about;
    // a product needs a brand and category that still exist
    var bIds = {}, cIds = {};
    C.BRANDS.forEach(function (b) { bIds[b.id] = 1; if (b.color) keepTint['b-' + b.id] = b.color; });
    C.CATEGORIES.forEach(function (c) { cIds[c.id] = 1; });
    C.PRODUCTS = C.PRODUCTS.filter(function (p) { return bIds[p.brand] && cIds[p.cat] && !p.hidden; });
  }).catch(function () {}).then(function () { clearTimeout(timer); boot(); });
})();
