/*
 * Admin panel for Sri Rama Mohana Agencies.
 * Everything the public site shows is stored in Supabase table `content` (see supabase/schema.sql):
 *   { kind, id, sort, data }  kind = brand | category | product | guide | about | settings
 * Uploads (logos, product photos, About Us photos and videos) go to the public storage bucket `media`.
 * The public site reads the same table through assets/js/remote.js, so a save here shows there on reload.
 */
(function () {
  'use strict';

  var CFG = window.PG_CONFIG || {}, STATIC = window.CATALOG || {};
  var APPS = STATIC.APPS || {}, SPEC = STATIC.SPEC_LABELS || {}, TINT = STATIC.TINT || {};
  var SHAPES = ['bag', 'sack', 'pail', 'can', 'bottle', 'cartridge', 'padlock', 'mortise', 'block', 'roll', 'rebar'];
  var main = document.getElementById('main'), tabsEl = document.getElementById('tabs'), logoutBtn = document.getElementById('logout');
  var sb = null, db = { brand: [], category: [], product: [], guide: [], about: [], settings: null }, tab = 'product';
  var filt = { q: '', brand: '', cat: '', stock: '' };

  /* ---------- small helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var tt; function toast(t) { var e = document.getElementById('toast'); e.textContent = t; e.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { e.classList.remove('on'); }, 3000); }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60); }
  function lines(v) { return String(v || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); }
  function byId(kind, id) { return db[kind].filter(function (x) { return x.id === id; })[0]; }
  function fail(e) { console.error(e); toast('Error: ' + ((e && e.message) || e)); }
  function val(form, name) { var el = form.elements[name]; return el ? el.value.trim() : ''; }
  function staticPhoto(id) { return (STATIC.PHOTOS || []).indexOf(id) > -1 ? '../assets/img/products/' + id + '.png' : ''; }
  var SVG_LOGO = { nagarjuna: 1, birlawhite: 1, hardworker: 1, godrej: 1, sagar: 1, birlaopus: 1 };
  function imgOf(kind, x) {
    if (kind === 'product') return x.img || staticPhoto(x.id);
    if (kind === 'brand') return x.logo ? (/^(https?:|\/|data:)/.test(x.logo) ? x.logo : '../' + x.logo) : '../assets/img/brands/' + x.id + (SVG_LOGO[x.id] ? '.svg' : '.png');
    if (kind === 'category') return x.img || '../assets/img/cats/' + x.id + '.jpg';
    return '';
  }

  /* ---------- Supabase ---------- */
  if (!CFG.supabaseUrl || !CFG.supabaseKey || !window.supabase) {
    main.innerHTML = '<div class="banner err"><b>Supabase is not connected yet.</b><p>Open <code>assets/js/config.js</code> and fill in <code>supabaseUrl</code> and <code>supabaseKey</code> (the anon public key), then run <code>supabase/schema.sql</code> in the Supabase SQL editor. The README has the steps.</p></div>';
    return;
  }
  sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);

  function save(kind, item, oldId) {
    var row = { kind: kind, id: String(item.id), sort: Number(item.sort) || 0, data: item, updated_at: new Date().toISOString() };
    return sb.from('content').upsert(row).then(function (r) {
      if (r.error) throw r.error;
      if (oldId && oldId !== item.id) return sb.from('content').delete().eq('kind', kind).eq('id', oldId).then(function (d) { if (d.error) throw d.error; });
    }).then(function () {
      if (kind === 'settings') { db.settings = item; return; }
      db[kind] = db[kind].filter(function (x) { return x.id !== (oldId || item.id) && x.id !== item.id; });
      db[kind].push(item); sortKind(kind);
    });
  }
  function remove(kind, ids) {
    if (!ids.length) return Promise.resolve();
    return sb.from('content').delete().eq('kind', kind).in('id', ids).then(function (r) {
      if (r.error) throw r.error;
      db[kind] = db[kind].filter(function (x) { return ids.indexOf(x.id) < 0; });
    });
  }
  function sortKind(kind) { db[kind].sort(function (a, b) { return (Number(a.sort) || 0) - (Number(b.sort) || 0) || String(a.id).localeCompare(String(b.id)); }); }
  function load() {
    return sb.from('content').select('kind,id,sort,data').limit(10000).then(function (r) {
      if (r.error) throw r.error;
      db = { brand: [], category: [], product: [], guide: [], about: [], settings: null };
      r.data.forEach(function (row) {
        var d = row.data || {}; if (d.id == null) d.id = row.id; if (d.sort == null) d.sort = row.sort;
        if (row.kind === 'settings') db.settings = d; else if (db[row.kind]) db[row.kind].push(d);
      });
      ['brand', 'category', 'product', 'guide', 'about'].forEach(sortKind);
    });
  }
  function upload(file, folder) {
    var path = folder + '/' + Date.now() + '-' + slug(file.name.replace(/\.[^.]+$/, '')) + (file.name.match(/\.[^.]+$/) || [''])[0].toLowerCase();
    return sb.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false }).then(function (r) {
      if (r.error) throw r.error;
      return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
    });
  }

  /* ---------- auth ---------- */
  function showLogin(msg) {
    tabsEl.hidden = true; logoutBtn.hidden = true;
    main.innerHTML = '<form class="card login" id="login"><h1>Admin login</h1>' + (msg ? '<div class="banner err">' + esc(msg) + '</div>' : '') +
      '<label class="f"><span>Email</span><input type="email" name="email" required autocomplete="username"></label>' +
      '<label class="f"><span>Password</span><input type="password" name="password" required autocomplete="current-password"></label>' +
      '<button class="pri" type="submit">Log in</button></form>';
    $('#login').addEventListener('submit', function (e) {
      e.preventDefault(); var f = e.target, b = $('button', f); b.disabled = true;
      sb.auth.signInWithPassword({ email: val(f, 'email'), password: f.elements.password.value }).then(function (r) {
        b.disabled = false; if (r.error) return showLogin(r.error.message); start();
      });
    });
  }
  function start() {
    main.innerHTML = '<p class="muted">Loading content…</p>';
    load().then(function () { tabsEl.hidden = false; logoutBtn.hidden = false; render(); }).catch(fail);
  }
  logoutBtn.addEventListener('click', function () { sb.auth.signOut().then(function () { showLogin(); }); });
  tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-tab]'); if (!b) return;
    tab = b.getAttribute('data-tab'); $$('#tabs button').forEach(function (x) { x.classList.toggle('on', x === b); }); render();
  });
  sb.auth.getSession().then(function (r) { if (r.data && r.data.session) start(); else showLogin(); });

  /* ---------- import from the built-in catalog ---------- */
  function importBanner() {
    if (db.settings) return '';
    return '<div class="banner"><b>First step: copy the current website into the admin.</b><p>This copies every brand, category, product, the cement guide and the shop details from the built-in catalog into Supabase. After this, the public website shows what you manage here.</p><button class="pri" data-act="import">Import current website</button></div>';
  }
  function doImport(btn) {
    if (db.settings && !confirm('Content already exists. Import again and overwrite items with the same id?')) return;
    btn.disabled = true; btn.textContent = 'Importing…';
    var rows = [], photos = STATIC.PHOTOS || [];
    (STATIC.BRANDS || []).forEach(function (b, i) { var d = Object.assign({}, b, { sort: i * 10 }); rows.push({ kind: 'brand', id: b.id, sort: d.sort, data: d }); });
    (STATIC.CATEGORIES || []).forEach(function (c, i) { var d = Object.assign({}, c, { sort: i * 10 }); rows.push({ kind: 'category', id: c.id, sort: d.sort, data: d }); });
    (STATIC.PRODUCTS || []).forEach(function (p, i) { var d = Object.assign({ in_stock: true }, p, { sort: i * 10 }); rows.push({ kind: 'product', id: p.id, sort: d.sort, data: d }); });
    (STATIC.GUIDE || []).forEach(function (g, i) { var d = Object.assign({ id: 'guide-' + (i + 1) }, g, { sort: i * 10 }); rows.push({ kind: 'guide', id: d.id, sort: d.sort, data: d }); });
    rows.push({ kind: 'settings', id: 'site', sort: 0, data: Object.assign({ id: 'site' }, STATIC.SETTINGS || {}) });
    var chunks = []; for (var i = 0; i < rows.length; i += 200) chunks.push(rows.slice(i, i + 200));
    chunks.reduce(function (p, ch) { return p.then(function () { return sb.from('content').upsert(ch).then(function (r) { if (r.error) throw r.error; }); }); }, Promise.resolve())
      .then(load).then(function () { toast('Imported ' + rows.length + ' items. The public site now reads from Supabase.'); render(); })
      .catch(function (e) { btn.disabled = false; btn.textContent = 'Import current website'; fail(e); });
  }

  /* ---------- render dispatcher ---------- */
  function render() {
    var h = importBanner();
    if (tab === 'product') h += listProducts();
    else if (tab === 'brand') h += listSimple('brand', 'Brands', ['name', 'by'], 'Deleting a brand also deletes all of its products.');
    else if (tab === 'category') h += listSimple('category', 'Categories', ['en', 'te'], 'Deleting a category also deletes all products in it.');
    else if (tab === 'guide') h += listSimple('guide', 'Which cement for which job (home page guide)', ['en', 'pick'], '');
    else if (tab === 'about') h += listAbout();
    else if (tab === 'settings') h += formSettings();
    else if (tab === 'data') h += viewData();
    main.innerHTML = h;
    if (tab === 'settings') bindSettings();
  }

  /* ---------- products ---------- */
  function brandName(id) { var b = byId('brand', id); return b ? b.name : id; }
  function catName(id) { var c = byId('category', id); return c ? c.en : id; }
  function listProducts() {
    var q = filt.q.toLowerCase();
    var rows = db.product.filter(function (p) {
      if (filt.brand && p.brand !== filt.brand) return false;
      if (filt.cat && p.cat !== filt.cat) return false;
      if (filt.stock === 'out' && p.in_stock !== false) return false;
      if (filt.stock === 'in' && p.in_stock === false) return false;
      return !q || (p.name + ' ' + p.id + ' ' + brandName(p.brand)).toLowerCase().indexOf(q) > -1;
    });
    var outN = db.product.filter(function (p) { return p.in_stock === false; }).length;
    return '<div class="row"><h1 class="grow">Products <span class="muted">(' + db.product.length + ', ' + outN + ' out of stock)</span></h1><button class="pri" data-act="new" data-kind="product">+ Add product</button></div>' +
      '<div class="card row"><input type="text" id="f-q" placeholder="Search products" value="' + esc(filt.q) + '" class="grow" style="max-width:320px">' +
      '<select id="f-brand"><option value="">All brands</option>' + db.brand.map(function (b) { return '<option value="' + esc(b.id) + '"' + (filt.brand === b.id ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</select>' +
      '<select id="f-cat"><option value="">All categories</option>' + db.category.map(function (c) { return '<option value="' + esc(c.id) + '"' + (filt.cat === c.id ? ' selected' : '') + '>' + esc(c.en) + '</option>'; }).join('') + '</select>' +
      '<select id="f-stock"><option value="">Any stock</option><option value="in"' + (filt.stock === 'in' ? ' selected' : '') + '>In stock</option><option value="out"' + (filt.stock === 'out' ? ' selected' : '') + '>Out of stock</option></select></div>' +
      '<div class="tblwrap"><table><thead><tr><th></th><th>Product</th><th>Brand</th><th>Category</th><th>Stock</th><th></th></tr></thead><tbody>' +
      rows.map(function (p) {
        var im = imgOf('product', p);
        return '<tr><td>' + (im ? '<img class="t" src="' + esc(im) + '" alt="" loading="lazy">' : '') + '</td>' +
          '<td><b>' + esc(p.name) + '</b><br><small class="muted">' + esc(p.id) + '</small> ' + (p.hidden ? '<span class="pill hid">hidden</span>' : '') + (p.mrp ? ' <span class="pill">MRP ₹' + esc(p.mrp[0]) + '–' + esc(p.mrp[1]) + '</span>' : '') + '</td>' +
          '<td>' + esc(brandName(p.brand)) + '</td><td>' + esc(catName(p.cat)) + '</td>' +
          '<td><label class="switch"><input type="checkbox" data-act="stock" data-id="' + esc(p.id) + '"' + (p.in_stock !== false ? ' checked' : '') + '><span>' + (p.in_stock !== false ? 'In stock' : 'Out of stock') + '</span></label></td>' +
          '<td class="row"><button data-act="edit" data-kind="product" data-id="' + esc(p.id) + '">Edit</button><button class="danger" data-act="del" data-kind="product" data-id="' + esc(p.id) + '">Delete</button></td></tr>';
      }).join('') + '</tbody></table></div>' + (rows.length ? '' : '<p class="muted">No products match.</p>');
  }

  function imgField(name, label, cur, hint) {
    return '<label class="f"><span>' + label + ' <small>' + (hint || 'upload a file or paste a link') + '</small></span>' +
      (cur ? '<img class="preview-img" src="' + esc(cur) + '" alt="">' : '') +
      '<input type="file" accept="image/*" data-upload="' + name + '"><input type="url" name="' + name + '" value="' + esc(cur && !/^\.\.\//.test(cur) ? cur : '') + '" placeholder="https://… (leave empty to keep the built-in image)"></label>';
  }
  function opt(list, cur, labelKey) { return list.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === cur ? ' selected' : '') + '>' + esc(x[labelKey]) + '</option>'; }).join(''); }

  function formProduct(p) {
    var isNew = !p; p = p || { in_stock: true, shape: 'bag', tint: 'grey', specs: {}, apps: [], feats: [] };
    var sp = p.specs || {};
    return '<form class="card" id="edit" data-kind="product" data-old="' + esc(isNew ? '' : p.id) + '"><h1>' + (isNew ? 'Add product' : 'Edit ' + esc(p.name)) + '</h1>' +
      '<div class="grid2"><label class="f"><span>Name</span><input type="text" name="name" required value="' + esc(p.name) + '"></label>' +
      '<label class="f"><span>ID <small>(used in the web address; letters, numbers, dashes)</small></span><input type="text" name="id" value="' + esc(p.id) + '" placeholder="made from the name if empty"></label>' +
      '<label class="f"><span>Brand</span><select name="brand" required>' + opt(db.brand, p.brand, 'name') + '</select></label>' +
      '<label class="f"><span>Category</span><select name="cat" required>' + opt(db.category, p.cat, 'en') + '</select></label></div>' +
      '<div class="row" style="margin-bottom:.8rem"><label class="switch"><input type="checkbox" name="in_stock"' + (p.in_stock !== false ? ' checked' : '') + '><span>In stock</span></label>' +
      '<label class="switch"><input type="checkbox" name="hidden"' + (p.hidden ? ' checked' : '') + '><span>Hide from website</span></label></div>' +
      '<label class="f"><span>Telugu one-liner</span><input type="text" name="te" value="' + esc(p.te) + '"></label>' +
      '<label class="f"><span>Description</span><textarea name="desc" rows="4">' + esc(p.desc) + '</textarea></label>' +
      '<label class="f"><span>Why people choose it <small>(one point per line)</small></span><textarea name="feats">' + esc((p.feats || []).join('\n')) + '</textarea></label>' +
      '<div class="f"><span><b>Where to use it</b></span><div class="checks">' + Object.keys(APPS).map(function (k) { return '<label><input type="checkbox" name="apps" value="' + k + '"' + ((p.apps || []).indexOf(k) > -1 ? ' checked' : '') + '>' + esc(APPS[k][0]) + '</label>'; }).join('') + '</div></div>' +
      '<h2>Details table</h2><div class="grid2">' + Object.keys(SPEC).map(function (k) { return '<label class="f"><span>' + esc(SPEC[k][0]) + '</span><input type="text" name="spec_' + k + '" value="' + esc(sp[k]) + '"></label>'; }).join('') + '</div>' +
      '<h2>Price and finishes <small class="muted">(optional, shown with a "negotiable" note)</small></h2><div class="grid2">' +
      '<label class="f"><span>MRP from (₹)</span><input type="number" min="0" name="mrp0" value="' + esc(p.mrp ? p.mrp[0] : '') + '"></label>' +
      '<label class="f"><span>MRP to (₹)</span><input type="number" min="0" name="mrp1" value="' + esc(p.mrp ? p.mrp[1] : '') + '"></label></div>' +
      '<label class="f"><span>Finishes / colours <small>(one per line)</small></span><textarea name="finishes">' + esc((p.finishes || []).join('\n')) + '</textarea></label>' +
      '<h2>Picture</h2>' + imgField('img', 'Pack photo', imgOf('product', p)) +
      '<h2>Videos</h2><label class="f"><span>YouTube video links <small>(one link per line; shown after the photo on the product page, e.g. installation videos)</small></span><textarea name="videos" rows="3" placeholder="https://www.youtube.com/watch?v=...">' + esc((p.videos || []).join('\n')) + '</textarea></label>' +
      '<div class="grid2"><label class="f"><span>3D shape when there is no photo</span><select name="shape">' + SHAPES.map(function (s) { return '<option' + (s === p.shape ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></label>' +
      '<label class="f"><span>Colour</span><select name="tint">' + Object.keys(TINT).map(function (t) { return '<option' + (t === p.tint ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label>' +
      '<label class="f"><span>Order <small>(smaller shows first)</small></span><input type="number" name="sort" value="' + esc(p.sort || 0) + '"></label></div>' +
      saveBar();
  }
  function readProduct(f, old) {
    var o = Object.assign({}, old || {});
    o.name = val(f, 'name'); o.id = slug(val(f, 'id') || o.name);
    o.brand = val(f, 'brand'); o.cat = val(f, 'cat');
    o.in_stock = f.elements.in_stock.checked; o.hidden = f.elements.hidden.checked;
    o.te = val(f, 'te'); o.desc = val(f, 'desc'); o.feats = lines(f.elements.feats.value);
    o.apps = $$('input[name=apps]:checked', f).map(function (x) { return x.value; });
    o.specs = {}; Object.keys(SPEC).forEach(function (k) { var v = val(f, 'spec_' + k); if (v) o.specs[k] = v; });
    var m0 = val(f, 'mrp0'), m1 = val(f, 'mrp1');
    if (m0 || m1) o.mrp = [Number(m0 || m1), Number(m1 || m0)]; else delete o.mrp;
    var fins = lines(f.elements.finishes.value); if (fins.length) o.finishes = fins; else delete o.finishes;
    var img = val(f, 'img'); if (img) o.img = img; else delete o.img;
    var vids = lines(f.elements.videos.value).map(function (u) {
      var m = u.match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/); return m ? 'https://www.youtube.com/watch?v=' + m[1] : '';
    }).filter(Boolean);
    if (vids.length) o.videos = vids; else delete o.videos;
    o.shape = val(f, 'shape'); o.tint = val(f, 'tint'); o.sort = Number(val(f, 'sort')) || 0;
    return o;
  }

  /* ---------- brands, categories, guide ---------- */
  function listSimple(kind, title, cols, note) {
    return '<div class="row"><h1 class="grow">' + title + ' <span class="muted">(' + db[kind].length + ')</span></h1><button class="pri" data-act="new" data-kind="' + kind + '">+ Add</button></div>' +
      (note ? '<p class="muted">' + note + '</p>' : '') +
      '<div class="tblwrap"><table><tbody>' + db[kind].map(function (x) {
        var im = imgOf(kind, x), n = kind === 'brand' ? db.product.filter(function (p) { return p.brand === x.id; }).length : kind === 'category' ? db.product.filter(function (p) { return p.cat === x.id; }).length : null;
        return '<tr><td>' + (im ? '<img class="t" src="' + esc(im) + '" alt="" loading="lazy">' : '') + '</td><td><b>' + esc(x[cols[0]]) + '</b><br><small class="muted">' + esc(x[cols[1]] || '') + '</small></td>' +
          '<td>' + (n != null ? n + ' products' : '') + (x.ask ? ' <span class="pill">Ask us</span>' : '') + '</td>' +
          '<td class="row"><button data-act="edit" data-kind="' + kind + '" data-id="' + esc(x.id) + '">Edit</button><button class="danger" data-act="del" data-kind="' + kind + '" data-id="' + esc(x.id) + '">Delete</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function formBrand(b) {
    var isNew = !b; b = b || {};
    return '<form class="card" id="edit" data-kind="brand" data-old="' + esc(isNew ? '' : b.id) + '"><h1>' + (isNew ? 'Add brand' : 'Edit ' + esc(b.name)) + '</h1><div class="grid2">' +
      '<label class="f"><span>Brand name</span><input type="text" name="name" required value="' + esc(b.name) + '"></label>' +
      '<label class="f"><span>ID</span><input type="text" name="id" value="' + esc(b.id) + '" placeholder="made from the name if empty"></label>' +
      '<label class="f"><span>Name in Telugu</span><input type="text" name="te" value="' + esc(b.te) + '"></label>' +
      '<label class="f"><span>Company</span><input type="text" name="by" value="' + esc(b.by) + '"></label>' +
      '<label class="f"><span>Manufacturer website</span><input type="url" name="site" value="' + esc(b.site) + '"></label>' +
      '<label class="f"><span>Brand colour <small>(used on the 3D bags)</small></span><input type="color" name="color" value="' + esc(b.color || TINT['b-' + b.id] || '#C9A06A') + '"></label></div>' +
      '<label class="f"><span>About the brand (English)</span><textarea name="en">' + esc(b.en) + '</textarea></label>' +
      '<label class="f"><span>About the brand (Telugu)</span><textarea name="tel">' + esc(b.tel) + '</textarea></label>' +
      imgField('logo', 'Logo', imgOf('brand', b)) +
      '<label class="f"><span>Order</span><input type="number" name="sort" value="' + esc(b.sort || 0) + '"></label>' + saveBar();
  }
  function readBrand(f, old) {
    var o = Object.assign({}, old || {});
    ['name', 'te', 'by', 'site', 'en', 'tel', 'color'].forEach(function (k) { o[k] = val(f, k); });
    o.id = slug(val(f, 'id') || o.name); var l = val(f, 'logo'); if (l) o.logo = l; else delete o.logo;
    o.sort = Number(val(f, 'sort')) || 0; return o;
  }
  function formCategory(c) {
    var isNew = !c; c = c || { shape: 'bag', tint: 'kraft' };
    return '<form class="card" id="edit" data-kind="category" data-old="' + esc(isNew ? '' : c.id) + '"><h1>' + (isNew ? 'Add category' : 'Edit ' + esc(c.en)) + '</h1><div class="grid2">' +
      '<label class="f"><span>Name (English)</span><input type="text" name="en" required value="' + esc(c.en) + '"></label>' +
      '<label class="f"><span>Name (Telugu)</span><input type="text" name="te" value="' + esc(c.te) + '"></label>' +
      '<label class="f"><span>ID</span><input type="text" name="id" value="' + esc(c.id) + '" placeholder="made from the name if empty"></label>' +
      '<label class="f"><span>Order</span><input type="number" name="sort" value="' + esc(c.sort || 0) + '"></label></div>' +
      '<label class="f"><span>Intro (English)</span><textarea name="introEn">' + esc(c.introEn) + '</textarea></label>' +
      '<label class="f"><span>Intro (Telugu)</span><textarea name="introTe">' + esc(c.introTe) + '</textarea></label>' +
      '<label class="switch" style="margin-bottom:.8rem"><input type="checkbox" name="ask"' + (c.ask ? ' checked' : '') + '><span>Show as "Ask us" (no products listed yet)</span></label>' +
      imgField('img', 'Tile photo (home page)', imgOf('category', c)) +
      '<div class="grid2"><label class="f"><span>3D shape</span><select name="shape">' + SHAPES.map(function (s) { return '<option' + (s === c.shape ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></label>' +
      '<label class="f"><span>Colour</span><select name="tint">' + Object.keys(TINT).map(function (t) { return '<option' + (t === c.tint ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label></div>' + saveBar();
  }
  function readCategory(f, old) {
    var o = Object.assign({}, old || {});
    ['en', 'te', 'introEn', 'introTe', 'shape', 'tint'].forEach(function (k) { o[k] = val(f, k); });
    o.id = slug(val(f, 'id') || o.en); o.ask = f.elements.ask.checked; if (!o.ask) delete o.ask;
    var im = val(f, 'img'); if (im) o.img = im; else delete o.img;
    o.sort = Number(val(f, 'sort')) || 0; return o;
  }
  function formGuide(g) {
    var isNew = !g; g = g || { ids: [] };
    return '<form class="card" id="edit" data-kind="guide" data-old="' + esc(isNew ? '' : g.id) + '"><h1>' + (isNew ? 'Add guide row' : 'Edit guide row') + '</h1><div class="grid2">' +
      '<label class="f"><span>Job (English)</span><input type="text" name="en" required value="' + esc(g.en) + '"></label>' +
      '<label class="f"><span>Job (Telugu)</span><input type="text" name="te" value="' + esc(g.te) + '"></label>' +
      '<label class="f"><span>What to pick</span><input type="text" name="pick" value="' + esc(g.pick) + '"></label>' +
      '<label class="f"><span>Order</span><input type="number" name="sort" value="' + esc(g.sort || 0) + '"></label></div>' +
      '<label class="f"><span>Suggested products <small>(hold Ctrl to pick several)</small></span><select name="ids" multiple size="10">' +
      db.product.map(function (p) { return '<option value="' + esc(p.id) + '"' + ((g.ids || []).indexOf(p.id) > -1 ? ' selected' : '') + '>' + esc(p.name) + '</option>'; }).join('') + '</select></label>' + saveBar();
  }
  function readGuide(f, old) {
    var o = Object.assign({}, old || {});
    ['en', 'te', 'pick'].forEach(function (k) { o[k] = val(f, k); });
    o.ids = $$('select[name=ids] option', f).filter(function (x) { return x.selected; }).map(function (x) { return x.value; });
    o.id = o.id || 'guide-' + Date.now(); o.sort = Number(val(f, 'sort')) || 0; return o;
  }

  /* ---------- About Us ---------- */
  function listAbout() {
    var posts = db.about.slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
    return '<div class="row"><h1 class="grow">About Us posts <span class="muted">(' + posts.length + ')</span></h1><button class="pri" data-act="new" data-kind="about">+ New post</button></div>' +
      '<p class="muted">Each post shows on the About Us page, newest first: trips, meetings, reviews, milestones, with photos and videos. The page title and intro are under Shop details.</p>' +
      '<div class="tblwrap"><table><tbody>' + posts.map(function (x) {
        var first = (x.media || []).filter(function (m) { return m.type === 'image'; })[0];
        return '<tr><td>' + (first ? '<img class="t" src="' + esc(first.url) + '" alt="">' : '') + '</td><td><b>' + esc(x.titleEn) + '</b><br><small class="muted">' + esc([x.date, x.place, (x.media || []).length + ' media'].filter(Boolean).join(' · ')) + '</small></td>' +
          '<td class="row"><button data-act="edit" data-kind="about" data-id="' + esc(x.id) + '">Edit</button><button class="danger" data-act="del" data-kind="about" data-id="' + esc(x.id) + '">Delete</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  var draftMedia = [];
  function mediaHtml() {
    return draftMedia.map(function (m, i) {
      var pv = m.type === 'video' ? '<video src="' + esc(m.url) + '" preload="metadata" muted></video>' : m.type === 'youtube' ? '<div class="yt">YouTube<br>' + esc(m.url) + '</div>' : '<img src="' + esc(m.url) + '" alt="">';
      return '<div class="media-item">' + pv + '<input type="text" data-cap="' + i + '" placeholder="Caption" value="' + esc(m.caption || '') + '" style="margin:.3rem 0">' +
        '<div class="row"><button type="button" data-act="mup" data-i="' + i + '">↑</button><button type="button" data-act="mdown" data-i="' + i + '">↓</button><button type="button" class="danger" data-act="mrm" data-i="' + i + '">Remove</button></div></div>';
    }).join('');
  }
  function formAbout(a) {
    var isNew = !a; a = a || { date: new Date().toISOString().slice(0, 10), media: [] };
    draftMedia = (a.media || []).map(function (m) { return Object.assign({}, m); });
    return '<form class="card" id="edit" data-kind="about" data-old="' + esc(isNew ? '' : a.id) + '"><h1>' + (isNew ? 'New About Us post' : 'Edit post') + '</h1><div class="grid2">' +
      '<label class="f"><span>Title (English)</span><input type="text" name="titleEn" required value="' + esc(a.titleEn) + '"></label>' +
      '<label class="f"><span>Title (Telugu)</span><input type="text" name="titleTe" value="' + esc(a.titleTe) + '"></label>' +
      '<label class="f"><span>Date</span><input type="date" name="date" value="' + esc(a.date) + '"></label>' +
      '<label class="f"><span>Place <small>(city or state)</small></span><input type="text" name="place" value="' + esc(a.place) + '"></label>' +
      '<label class="f"><span>Type</span><select name="tag">' + ['', 'Milestone', 'Visit', 'Meeting', 'Review', 'Event', 'Award'].map(function (t) { return '<option' + (t === (a.tag || '') ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label></div>' +
      '<label class="f"><span>Description (English)</span><textarea name="bodyEn" rows="5">' + esc(a.bodyEn) + '</textarea></label>' +
      '<label class="f"><span>Description (Telugu)</span><textarea name="bodyTe" rows="5">' + esc(a.bodyTe) + '</textarea></label>' +
      '<h2>Photos and videos</h2><p class="muted">Upload photos and videos (each file up to 50 MB on the free Supabase plan). For long videos, upload to YouTube and paste the link.</p>' +
      '<div class="row"><input type="file" id="m-files" accept="image/*,video/*" multiple><input type="url" id="m-yt" placeholder="YouTube link" class="grow" style="max-width:360px"><button type="button" data-act="addyt">Add YouTube link</button></div>' +
      '<p id="m-status" class="muted"></p><div class="media-list" id="m-list">' + mediaHtml() + '</div>' + saveBar();
  }
  function ytEmbed(u) {
    var m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    return m ? 'https://www.youtube.com/embed/' + m[1] : '';
  }
  function readAbout(f, old) {
    var o = Object.assign({}, old || {});
    ['titleEn', 'titleTe', 'date', 'place', 'tag', 'bodyEn', 'bodyTe'].forEach(function (k) { o[k] = val(f, k); });
    $$('[data-cap]', f).forEach(function (el) { var m = draftMedia[+el.getAttribute('data-cap')]; if (m) m.caption = el.value.trim(); });
    o.media = draftMedia.slice(); o.id = o.id || 'post-' + Date.now(); o.sort = 0; return o;
  }

  /* ---------- shop details (settings) ---------- */
  function formSettings() {
    var s = db.settings || STATIC.SETTINGS || {}, a = s.about || {};
    if (!db.settings) return '<p class="muted">Import the website first (button above), then edit the shop details here.</p>';
    return '<form class="card" id="settings"><h1>Shop details and page text</h1>' +
      '<h2>Phone numbers <small class="muted">(shown in the footer, Visit section and Call buttons; the first is the main one)</small></h2><div id="phones">' +
      (s.phones || []).map(phoneRow).join('') + '</div><button type="button" data-act="addphone">+ Add number</button>' +
      '<div class="grid2" style="margin-top:1rem"><label class="f"><span>WhatsApp number <small>(with 91, digits only)</small></span><input type="text" name="whatsapp" value="' + esc(s.whatsapp) + '"></label>' +
      '<label class="f"><span>Opening hours</span><input type="text" name="hours" value="' + esc(s.hours) + '"></label></div>' +
      '<label class="f"><span>Address <small>(one line per row)</small></span><textarea name="address">' + esc(s.address) + '</textarea></label>' +
      '<h2>Home page hero <small class="muted">(leave empty for the default text)</small></h2><div class="grid2">' +
      '<label class="f"><span>Headline (English)</span><input type="text" name="heroTitleEn" value="' + esc(s.heroTitleEn) + '"></label>' +
      '<label class="f"><span>Headline (Telugu)</span><input type="text" name="heroTitleTe" value="' + esc(s.heroTitleTe) + '"></label></div>' +
      '<label class="f"><span>Intro line (English)</span><textarea name="heroLeadEn">' + esc(s.heroLeadEn) + '</textarea></label>' +
      '<label class="f"><span>Intro line (Telugu)</span><textarea name="heroLeadTe">' + esc(s.heroLeadTe) + '</textarea></label>' +
      '<h2>About Us page</h2><div class="grid2">' +
      '<label class="f"><span>Page title (English)</span><input type="text" name="aboutTitleEn" value="' + esc(a.titleEn) + '"></label>' +
      '<label class="f"><span>Page title (Telugu)</span><input type="text" name="aboutTitleTe" value="' + esc(a.titleTe) + '"></label></div>' +
      '<label class="f"><span>Intro (English)</span><textarea name="aboutIntroEn">' + esc(a.introEn) + '</textarea></label>' +
      '<label class="f"><span>Intro (Telugu)</span><textarea name="aboutIntroTe">' + esc(a.introTe) + '</textarea></label>' +
      '<div class="sticky-save"><button class="pri" type="submit">Save shop details</button></div></form>';
  }
  function phoneRow(p) {
    p = p || {};
    return '<div class="phone-row"><input type="text" data-ph="num" placeholder="Number with 91, e.g. 919394234081" value="' + esc(p.num) + '"><input type="text" data-ph="show" placeholder="Shown as, e.g. 93942 34081" value="' + esc(p.show) + '"><input type="text" data-ph="name" placeholder="Name (optional)" value="' + esc(p.name) + '"><button type="button" class="danger" data-act="rmphone">Remove</button></div>';
  }
  function bindSettings() {
    var f = $('#settings'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = Object.assign({}, db.settings);
      s.phones = $$('.phone-row', f).map(function (r) {
        var num = $('[data-ph=num]', r).value.replace(/\D/g, ''); return { num: num, show: $('[data-ph=show]', r).value.trim() || num, name: $('[data-ph=name]', r).value.trim() };
      }).filter(function (p) { return p.num; });
      ['whatsapp', 'hours', 'address', 'heroTitleEn', 'heroTitleTe', 'heroLeadEn', 'heroLeadTe'].forEach(function (k) { s[k] = val(f, k); });
      s.whatsapp = s.whatsapp.replace(/\D/g, '');
      s.about = { titleEn: val(f, 'aboutTitleEn'), titleTe: val(f, 'aboutTitleTe'), introEn: val(f, 'aboutIntroEn'), introTe: val(f, 'aboutIntroTe') };
      s.id = 'site';
      var b = $('button[type=submit]', f); b.disabled = true;
      save('settings', s).then(function () { b.disabled = false; toast('Saved. Reload the website to see it.'); }).catch(function (er) { b.disabled = false; fail(er); });
    });
  }

  /* ---------- backup ---------- */
  function viewData() {
    return '<h1>Backup</h1><div class="card"><p>Download everything (brands, categories, products, guide, About Us, shop details) as one JSON file. Uploaded photos and videos stay in Supabase storage.</p><button class="pri" data-act="export">Download backup</button></div>' +
      '<div class="card"><h2 style="margin-top:0">Update one brand from the built-in catalog</h2><p>Replaces every product of the chosen brand with the list built into the website (for example, after a new Godrej price list or new videos), and adds or updates the categories those products use. Stock switches, hidden products and photos or videos you set in the admin are kept. Other brands, About Us and shop details are not touched.</p>' +
      '<div class="row"><select id="sync-brand">' + (STATIC.BRANDS || []).map(function (b) { return '<option value="' + esc(b.id) + '"' + (b.id === 'godrej' ? ' selected' : '') + '>' + esc(b.name) + ' (' + (STATIC.PRODUCTS || []).filter(function (p) { return p.brand === b.id; }).length + ' built-in products)</option>'; }).join('') + '</select>' +
      '<button class="pri" data-act="syncbrand">Replace this brand\'s products</button></div></div>' +
      '<div class="card"><p>Copy the whole built-in website catalog into Supabase again. Items with the same id are overwritten (this also resets stock switches); items you added stay.</p><button data-act="import">Re-import built-in catalog</button></div>';
  }
  function syncBrand(btn) {
    var bid = $('#sync-brand').value, brand = (STATIC.BRANDS || []).filter(function (b) { return b.id === bid; })[0];
    var prods = (STATIC.PRODUCTS || []).filter(function (p) { return p.brand === bid; });
    var catIds = prods.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; });
    var cats = (STATIC.CATEGORIES || []).filter(function (c) { return catIds.indexOf(c.id) > -1; });
    var old = db.product.filter(function (p) { return p.brand === bid; });
    if (!confirm('Replace ' + old.length + ' ' + brand.name + ' products in the admin with the ' + prods.length + ' built-in ones? Download a backup first if unsure.')) return;
    btn.disabled = true; btn.textContent = 'Updating…';
    var rows = [];
    if (!byId('brand', bid)) rows.push({ kind: 'brand', id: bid, sort: 999, data: Object.assign({ sort: 999 }, brand) });
    cats.forEach(function (c) {
      var cur = byId('category', c.id), sort = cur ? cur.sort : (STATIC.CATEGORIES.indexOf(c) * 10);
      var d = Object.assign({}, cur || {}, c, { sort: sort, img: cur && cur.img ? cur.img : c.img });
      if (!d.img) delete d.img;
      if (!c.ask) delete d.ask; // the category now has products
      rows.push({ kind: 'category', id: c.id, sort: sort, data: d });
    });
    prods.forEach(function (p, i) {
      var d = Object.assign({ in_stock: true }, p, { sort: 5000 + i }), cur = byId('product', p.id);
      if (cur) { // keep what was set in the admin: stock switch, hidden, own photo, own videos
        if (cur.in_stock === false) d.in_stock = false;
        if (cur.hidden) d.hidden = true;
        if (cur.img) d.img = cur.img;
        if (cur.videos && cur.videos.length) d.videos = cur.videos;
      }
      rows.push({ kind: 'product', id: p.id, sort: d.sort, data: d });
    });
    remove('product', old.map(function (p) { return p.id; })).then(function () {
      var chunks = []; for (var i = 0; i < rows.length; i += 200) chunks.push(rows.slice(i, i + 200));
      return chunks.reduce(function (pr, ch) { return pr.then(function () { return sb.from('content').upsert(ch).then(function (r) { if (r.error) throw r.error; }); }); }, Promise.resolve());
    }).then(load).then(function () { toast(brand.name + ': ' + prods.length + ' products are live now.'); render(); })
      .catch(function (e) { btn.disabled = false; btn.textContent = 'Replace this brand\'s products'; fail(e); });
  }

  /* ---------- forms: open, save, delete ---------- */
  var FORMS = { product: [formProduct, readProduct], brand: [formBrand, readBrand], category: [formCategory, readCategory], guide: [formGuide, readGuide], about: [formAbout, readAbout] };
  function saveBar() { return '<div class="sticky-save"><button class="pri" type="submit">Save</button><button type="button" data-act="cancel">Cancel</button></div></form>'; }
  function openForm(kind, id) {
    var item = id ? byId(kind, id) : null;
    main.innerHTML = FORMS[kind][0](item ? JSON.parse(JSON.stringify(item)) : null);
    window.scrollTo(0, 0);
    var f = $('#edit');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var oldId = f.getAttribute('data-old') || '', next = FORMS[kind][1](f, item);
      if (!next.id) return toast('Please give it a name.');
      if (next.id !== oldId && byId(kind, next.id)) return toast('That ID is already used. Pick another.');
      var b = $('button[type=submit]', f); b.disabled = true;
      var renames = [];
      if (oldId && next.id !== oldId) {
        if (kind === 'brand') renames = db.product.filter(function (p) { return p.brand === oldId; }).map(function (p) { return Object.assign({}, p, { brand: next.id }); });
        if (kind === 'category') renames = db.product.filter(function (p) { return p.cat === oldId; }).map(function (p) { return Object.assign({}, p, { cat: next.id }); });
      }
      save(kind, next, oldId).then(function () { return Promise.all(renames.map(function (p) { return save('product', p); })); })
        .then(function () { toast('Saved. It is live on the website now.'); render(); }).catch(function (er) { b.disabled = false; fail(er); });
    });
  }
  function del(kind, id) {
    var item = byId(kind, id); if (!item) return;
    var name = item.name || item.en || item.titleEn || id, linked = [];
    if (kind === 'brand') linked = db.product.filter(function (p) { return p.brand === id; });
    if (kind === 'category') linked = db.product.filter(function (p) { return p.cat === id; });
    var msg = 'Delete "' + name + '"' + (linked.length ? ' and its ' + linked.length + ' products' : '') + ' from the website? This cannot be undone (download a backup first if unsure).';
    if (!confirm(msg)) return;
    remove('product', linked.map(function (p) { return p.id; })).then(function () { return remove(kind, [id]); })
      .then(function () { toast('Deleted "' + name + '".'); render(); }).catch(fail);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act'), kind = t.getAttribute('data-kind'), id = t.getAttribute('data-id');
    if (act === 'stock') {
      var p = byId('product', id), next = Object.assign({}, p, { in_stock: t.checked });
      t.disabled = true;
      save('product', next).then(function () { t.disabled = false; t.nextElementSibling.textContent = t.checked ? 'In stock' : 'Out of stock'; toast(p.name + ': ' + (t.checked ? 'in stock' : 'out of stock')); })
        .catch(function (er) { t.disabled = false; t.checked = !t.checked; fail(er); });
      return;
    }
    if (act === 'new') openForm(kind);
    else if (act === 'edit') openForm(kind, id);
    else if (act === 'del') del(kind, id);
    else if (act === 'cancel') render();
    else if (act === 'import') doImport(t);
    else if (act === 'syncbrand') syncBrand(t);
    else if (act === 'export') {
      var blob = new Blob([JSON.stringify(db, null, 1)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sri-rama-mohana-agencies-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    } else if (act === 'addphone') $('#phones').insertAdjacentHTML('beforeend', phoneRow());
    else if (act === 'rmphone') t.closest('.phone-row').remove();
    else if (act === 'addyt') {
      var u = ytEmbed($('#m-yt').value); if (!u) return toast('That does not look like a YouTube link.');
      draftMedia.push({ type: 'youtube', url: u, caption: '' }); $('#m-yt').value = ''; $('#m-list').innerHTML = mediaHtml();
    } else if (act === 'mrm' || act === 'mup' || act === 'mdown') {
      $$('[data-cap]').forEach(function (el) { var m = draftMedia[+el.getAttribute('data-cap')]; if (m) m.caption = el.value; });
      var i = +t.getAttribute('data-i');
      if (act === 'mrm') draftMedia.splice(i, 1);
      else { var j = act === 'mup' ? i - 1 : i + 1; if (j >= 0 && j < draftMedia.length) { var x = draftMedia[i]; draftMedia[i] = draftMedia[j]; draftMedia[j] = x; } }
      $('#m-list').innerHTML = mediaHtml();
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'f-brand') { filt.brand = t.value; render(); }
    else if (t.id === 'f-cat') { filt.cat = t.value; render(); }
    else if (t.id === 'f-stock') { filt.stock = t.value; render(); }
    else if (t.hasAttribute && t.hasAttribute('data-upload') && t.files[0]) {
      var name = t.getAttribute('data-upload'), target = t.form.elements[name];
      t.disabled = true; toast('Uploading…');
      upload(t.files[0], 'images').then(function (url) { target.value = url; t.disabled = false; toast('Uploaded. Press Save to keep it.'); })
        .catch(function (er) { t.disabled = false; fail(er); });
    } else if (t.id === 'm-files' && t.files.length) {
      var files = Array.prototype.slice.call(t.files), st = $('#m-status'), done = 0; t.disabled = true;
      $$('[data-cap]').forEach(function (el) { var m = draftMedia[+el.getAttribute('data-cap')]; if (m) m.caption = el.value; });
      files.reduce(function (p, file) {
        return p.then(function () {
          st.textContent = 'Uploading ' + (done + 1) + ' of ' + files.length + ': ' + file.name;
          if (file.size > 50 * 1024 * 1024) { toast(file.name + ' is over 50 MB. Upload it to YouTube and add the link.'); done++; return; }
          return upload(file, 'about').then(function (url) { draftMedia.push({ type: /^video\//.test(file.type) ? 'video' : 'image', url: url, caption: '' }); done++; $('#m-list').innerHTML = mediaHtml(); });
        });
      }, Promise.resolve()).then(function () { st.textContent = 'Uploaded. Press Save to publish the post.'; t.disabled = false; t.value = ''; })
        .catch(function (er) { st.textContent = ''; t.disabled = false; fail(er); });
    }
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'f-q') { filt.q = e.target.value; var pos = e.target.selectionStart; render(); var q = $('#f-q'); q.focus(); q.setSelectionRange(pos, pos); } });
})();
