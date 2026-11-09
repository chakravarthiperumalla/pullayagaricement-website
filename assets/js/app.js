/*
 * Pullayya Gari Cement Kottu: site logic (no framework, no build step).
 * Reads window.CATALOG (assets/js/catalog.js) and draws every page from it.
 * Routes (hash based, so it works on GitHub Pages and from a file):
 *   #/  #/categories  #/c/:cat  #/brands  #/b/:brand  #/p/:product  #/all  #/quote  #/visit
 */
(function () {
  'use strict';

  var C = window.CATALOG;
  var app = document.getElementById('app');
  if (!C) { app.innerHTML = '<p class="boot">The catalog did not load. Please refresh the page.</p>'; return; }

  /* ---------- constants ---------- */
  var PHONE = '918179951999', PHONE_SHOW = '81799 51999';
  var REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJYXtqRQDTNzoRZ1EW4Wtk4a8';
  var GEN_URL = 'https://chakravarthiperumalla.github.io/pullayagaricement-googlereview/';
  var MAPS_URL = 'https://maps.google.com/?cid=12673521240897900903';
  var DIR_URL = 'https://www.google.com/maps/dir/?api=1&destination=16.5412239,81.5264281';
  var SITE = 'Pullayya Gari Cement Kottu, Bhimavaram';
  var REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- lookups ---------- */
  var byId = {}, brandById = {}, catById = {};
  C.PRODUCTS.forEach(function (p) { byId[p.id] = p; });
  C.BRANDS.forEach(function (b) { brandById[b.id] = b; });
  C.CATEGORIES.forEach(function (c) { catById[c.id] = c; });

  function prodsOf(brand, cat) { return C.PRODUCTS.filter(function (p) { return p.brand === brand && (!cat || p.cat === cat); }); }
  function brandsIn(cat) { return C.BRANDS.filter(function (b) { return prodsOf(b.id, cat).length; }); }
  function catsOf(brand) { return C.CATEGORIES.filter(function (c) { return prodsOf(brand, c.id).length; }); }
  function hex(t) { return C.TINT[t] || '#9DA3A8'; }

  /* ---------- small helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function T(en, te) { return '<span class="l-en" lang="en">' + esc(en) + '</span><span class="l-te" lang="te">' + esc(te) + '</span>'; }
  function load(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function wa(text) { return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function mix(h, to, a) {
    var x = parseInt(h.slice(1), 16), y = parseInt(to.slice(1), 16);
    return '#' + [16, 8, 0].map(function (s) { var u = (x >> s) & 255, v = (y >> s) & 255; return ('0' + Math.round(u + (v - u) * a).toString(16)).slice(-2); }).join('');
  }
  function lineName(p) {
    var b = brandById[p.brand];
    var re = new RegExp('^' + b.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'i');
    return p.name.replace(re, '') || p.name;
  }
  function packMark(p) { var m = /(\d+)\s*kg/i.exec((p.specs && p.specs.pack) || ''); return m ? m[1] + ' KG' : ''; }
  function subLine(p) { var s = p.specs || {}; return [s.type, s.grade && !/^\d+$/.test(s.grade) ? s.grade : (s.grade ? s.grade + ' grade' : '')].filter(Boolean).join(' '); }

  /* ---------- language ---------- */
  var lang = load('pg-lang', 'te') === 'en' ? 'en' : 'te';
  function setLang(l) {
    lang = l; save('pg-lang', l);
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l);
    $$('[data-ph-en]').forEach(function (el) { el.setAttribute('placeholder', el.getAttribute(l === 'en' ? 'data-ph-en' : 'data-ph-te')); });
    var lb = $('#lang-btn'); if (lb) lb.setAttribute('aria-label', l === 'en' ? 'తెలుగులో చూడండి' : 'Switch to English');
  }

  /* ---------- enquiry list ---------- */
  var enquiry = [];
  try { enquiry = JSON.parse(load('pg-enquiry', '[]')).filter(function (id) { return byId[id]; }); } catch (e) { enquiry = []; }
  function saveEnq() { save('pg-enquiry', JSON.stringify(enquiry)); var n = $('#enq-n'); if (n) { n.textContent = enquiry.length; n.hidden = !enquiry.length; } }
  function toggleEnq(id) {
    var i = enquiry.indexOf(id);
    if (i > -1) enquiry.splice(i, 1); else enquiry.push(id);
    saveEnq();
    return i === -1;
  }

  var toastTimer;
  function toast(en, te) {
    var t = $('#toast'); if (!t) return;
    t.innerHTML = T(en, te); t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }

  /* ---------- drawn product thumbnails (no brand artwork) ---------- */
  function thumb(shape, tint, big) {
    var c = hex(tint), d = mix(c, '#000000', 0.38), l = mix(c, '#FFFFFF', 0.3), ink = '#241E20', o = '#F58220', s = '';
    switch (shape) {
      case 'bag':
      case 'sack': {
        var w = shape === 'bag' ? 60 : 50, h = shape === 'bag' ? 92 : 70, x = 60 - w / 2, y = 112 - h - 6;
        s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + c + '"/>' +
          '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="7" rx="3" fill="' + d + '"/>' +
          '<rect x="' + x + '" y="' + (y + h - 7) + '" width="' + w + '" height="7" rx="3" fill="' + d + '"/>' +
          '<rect x="' + x + '" y="' + (y + h * 0.22) + '" width="' + w + '" height="' + (h * 0.2) + '" fill="' + ink + '"/>' +
          '<rect x="' + x + '" y="' + (y + h * 0.42) + '" width="' + w + '" height="3" fill="' + o + '"/>' +
          '<rect x="' + (x + w * 0.2) + '" y="' + (y + h * 0.56) + '" width="' + w * 0.6 + '" height="5" rx="2" fill="' + ink + '" opacity=".75"/>' +
          '<rect x="' + (x + w * 0.3) + '" y="' + (y + h * 0.66) + '" width="' + w * 0.4 + '" height="4" rx="2" fill="' + ink + '" opacity=".5"/>' +
          '<path d="M' + (x + 4) + ' ' + (y + 10) + 'h' + (w - 8) + '" stroke="' + l + '" stroke-width="2" opacity=".6"/>';
        break;
      }
      case 'pail':
        s = '<path d="M30 40h60l-6 66H36z" fill="' + c + '"/><path d="M30 40h60l-1.2 13H31.200z" fill="' + d + '" opacity=".45"/>' +
          '<rect x="24" y="30" width="72" height="12" rx="4" fill="#C7CBCF"/><path d="M32 34q28-26 56 0" fill="none" stroke="#8C9196" stroke-width="2.5"/>' +
          '<rect x="34" y="62" width="52" height="22" fill="' + ink + '" opacity=".88"/><rect x="34" y="84" width="52" height="3" fill="' + o + '"/>';
        break;
      case 'can':
        s = '<rect x="32" y="40" width="56" height="68" rx="4" fill="' + c + '"/><rect x="29" y="31" width="62" height="11" rx="4" fill="#C7CBCF"/>' +
          '<path d="M34 36q26-24 52 0" fill="none" stroke="#8C9196" stroke-width="2.5"/><rect x="32" y="62" width="56" height="22" fill="' + ink + '" opacity=".88"/>' +
          '<rect x="32" y="84" width="56" height="3" fill="' + o + '"/>';
        break;
      case 'bottle':
        s = '<path d="M40 108V64q0-12 14-18V30h12v16q14 6 14 18v44z" fill="' + c + '"/><rect x="51" y="14" width="18" height="18" rx="3" fill="#F2F2EE"/>' +
          '<rect x="40" y="70" width="40" height="28" fill="#F4F2EC"/><rect x="45" y="76" width="30" height="6" rx="2" fill="' + ink + '" opacity=".8"/>' +
          '<rect x="49" y="86" width="22" height="4" rx="2" fill="' + o + '"/>';
        break;
      case 'cartridge':
        s = '<rect x="40" y="46" width="40" height="62" rx="3" fill="' + c + '"/><path d="M40 46L52 30h16l12 16z" fill="#EDEDEA"/><rect x="57" y="12" width="6" height="20" rx="2" fill="#EDEDEA"/>' +
          '<rect x="40" y="64" width="40" height="22" fill="' + ink + '" opacity=".88"/><rect x="40" y="86" width="40" height="3" fill="' + o + '"/>';
        break;
      case 'padlock':
        s = '<path d="M42 58V42a18 18 0 0 1 36 0v16" fill="none" stroke="#DDE1E5" stroke-width="8"/><rect x="28" y="54" width="64" height="54" rx="12" fill="#C6A04A"/>' +
          '<rect x="38" y="64" width="44" height="18" rx="2" fill="' + ink + '"/><circle cx="60" cy="92" r="5" fill="#2B2528"/><rect x="58" y="94" width="4" height="9" fill="#2B2528"/>';
        break;
      case 'mortise':
        s = '<rect x="40" y="8" width="40" height="104" rx="3" fill="#B9BDC3"/><circle cx="60" cy="40" r="12" fill="#2B2528"/><path d="M60 40h38" stroke="#2B2528" stroke-width="8" stroke-linecap="round"/>' +
          '<circle cx="60" cy="82" r="8" fill="#C6A04A"/><rect x="58.500" y="80" width="3" height="7" fill="#2B2528"/>';
        break;
      case 'block':
        s = '<rect x="14" y="40" width="92" height="50" rx="2" fill="#E7E7E2"/><g fill="#5a5a55" opacity=".3"><circle cx="24" cy="50" r="1.5"/><circle cx="40" cy="74" r="1.8"/><circle cx="52" cy="48" r="1.3"/><circle cx="70" cy="80" r="1.6"/><circle cx="88" cy="52" r="1.5"/><circle cx="96" cy="76" r="1.3"/><circle cx="30" cy="82" r="1.2"/></g><rect x="34" y="56" width="52" height="18" fill="' + o + '"/><rect x="40" y="62" width="40" height="5" fill="' + ink + '" opacity=".8"/>';
        break;
      case 'roll':
        s = '<rect x="18" y="36" width="84" height="56" rx="6" fill="#2B2B2E"/><rect x="46" y="36" width="28" height="56" fill="' + c + '"/><rect x="46" y="58" width="28" height="12" fill="' + ink + '" opacity=".85"/><ellipse cx="102" cy="64" rx="4" ry="28" fill="#3B3B3F"/>';
        break;
      case 'rebar':
        [26, 38, 50, 62, 74, 86].forEach(function (yy, i) {
          s += '<rect x="12" y="' + yy + '" width="96" height="10" rx="5" fill="#4A4E54"/><path d="M' + (20 + i * 3) + ' ' + yy + 'l8 10M' + (40 + i * 3) + ' ' + yy + 'l8 10M' + (60 + i * 3) + ' ' + yy + 'l8 10M' + (80 + i * 3) + ' ' + yy + 'l8 10" stroke="#8B9097" stroke-width="2"/><rect x="104" y="' + yy + '" width="4" height="10" rx="2" fill="' + o + '"/>';
        });
        break;
      default:
        s = '<rect x="30" y="20" width="60" height="86" rx="6" fill="' + c + '"/>';
    }
    return '<svg viewBox="0 0 120 120" role="img" aria-hidden="true" focusable="false"' + (big ? ' class="thumb-big"' : '') + '>' +
      '<ellipse cx="60" cy="112" rx="34" ry="4.500" fill="#000" opacity=".16"/>' + s + '</svg>';
  }

  /* ---------- shared pieces ---------- */
  function pcard(p) {
    var b = brandById[p.brand], sp = p.specs || {};
    var chips = [sp.type, sp.grade].filter(Boolean).map(function (v) { return '<span class="chip">' + esc(v) + '</span>'; }).join('');
    return '<a class="pcard" href="#/p/' + p.id + '" style="--t:' + mix(hex(p.tint), '#000000', 0.18) + '">' +
      '<span class="pcard-art">' + thumb(p.shape, p.tint) + '</span>' +
      '<span class="pcard-body"><span class="pcard-brand">' + esc(b.name) + '</span>' +
      '<strong class="pcard-name">' + esc(lineName(p)) + '</strong>' +
      '<span class="pcard-te l-te" lang="te">' + esc(p.te) + '</span>' +
      '<span class="pcard-chips">' + chips + '</span></span></a>';
  }
  function crumbs(list) {
    return '<nav class="crumbs" aria-label="Breadcrumb"><ol>' + list.map(function (c, i) {
      var last = i === list.length - 1;
      return '<li>' + (last ? '<span aria-current="page">' + c[0] + '</span>' : '<a href="' + c[1] + '">' + c[0] + '</a>') + '</li>';
    }).join('') + '</ol></nav>';
  }
  function sectionHead(h, p, id) {
    return '<header class="sh"><h2' + (id ? ' id="' + id + '"' : '') + '>' + h + '</h2>' + (p ? '<p>' + p + '</p>' : '') + '</header>';
  }
  var homeCrumb = ['<span class="l-en" lang="en">Home</span><span class="l-te" lang="te">హోమ్</span>', '#/'];

  /* ---------- sections (used on home and as their own pages) ---------- */
  function secCategories() {
    var tiles = C.CATEGORIES.map(function (c, i) {
      var nb = brandsIn(c.id).length, np = C.PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      var meta = c.ask ? '<span class="ask">' + T('Ask us', 'మమ్మల్ని అడగండి') + '</span>'
        : '<span class="meta">' + T(plural(nb, 'brand', 'brands') + ', ' + plural(np, 'product', 'products'), nb + ' బ్రాండ్లు, ' + np + ' ఉత్పత్తులు') + '</span>';
      return '<li class="' + (i === 0 ? 'cat-lead' : '') + '"><a class="cat' + (c.ask ? ' cat-ask' : '') + '" href="#/c/' + c.id + '" style="--t:' + hex(c.tint) + ';--s:' + mix(hex(c.tint), '#000000', 0.2) + '">' +
        '<span class="cat-art">' + thumb(c.shape, c.tint) + '</span>' +
        '<span class="cat-name">' + T(c.en, c.te) + '</span>' + meta + '</a></li>';
    }).join('');
    return '<section class="sec" aria-labelledby="h-cats">' +
      sectionHead(T('What are you building?', 'మీరు ఏమి కడుతున్నారు?'), T('Pick a category to see the brands we stock, then open a brand for every product.', 'కేటగిరీ ఎంచుకుంటే మా వద్ద ఉన్న బ్రాండ్లు కనిపిస్తాయి; బ్రాండ్ తెరిస్తే అన్ని ఉత్పత్తులు.'), 'h-cats') +
      '<ul class="cats">' + tiles + '</ul></section>';
  }

  function secBrands() {
    var rows = C.BRANDS.map(function (b) {
      var cs = catsOf(b.id), n = prodsOf(b.id).length;
      return '<li><a class="wall-row" href="#/b/' + b.id + '">' +
        '<span class="wall-name">' + esc(b.name) + '</span>' +
        '<span class="wall-te l-te" lang="te">' + esc(b.te) + '</span>' +
        '<span class="wall-by">' + esc(b.by) + '</span>' +
        '<span class="wall-cats">' + cs.map(function (c) { return '<span class="chip chip-line">' + T(c.en, c.te) + '</span>'; }).join('') + '</span>' +
        '<span class="wall-n">' + T(plural(n, 'product', 'products'), n + ' ఉత్పత్తులు') + '</span></a></li>';
    }).join('');
    return '<section class="sec sec-wall" aria-labelledby="h-brands">' +
      sectionHead(T('The brands on our shelves', 'మా షెల్ఫ్‌లలో ఉన్న బ్రాండ్లు'), T('Every brand from our visiting card, with the products we deal in.', 'మా విజిటింగ్ కార్డులోని ప్రతి బ్రాండ్, మేము అమ్మే ఉత్పత్తులతో.'), 'h-brands') +
      '<ul class="wall">' + rows + '</ul></section>';
  }

  function secGuide() {
    var rows = C.GUIDE.map(function (g) {
      return '<li class="g-row"><div class="g-job"><h3>' + T(g.en, g.te) + '</h3><p class="g-pick">' + esc(g.pick) + '</p></div>' +
        '<div class="g-ids">' + g.ids.filter(function (id) { return byId[id]; }).map(function (id) {
          var p = byId[id]; return '<a class="chip chip-link" href="#/p/' + id + '" style="--t:' + hex(p.tint) + '">' + esc(brandById[p.brand].name + ' ' + lineName(p)) + '</a>';
        }).join('') + '</div></li>';
    }).join('');
    return '<section class="sec sec-guide" aria-labelledby="h-guide">' +
      sectionHead(T('Which cement for which job', 'ఏ పనికి ఏ సిమెంట్'), T('A quick guide. For your site, send us the details and we will suggest the right one.', 'త్వరిత గైడ్. మీ సైట్ వివరాలు పంపితే సరైనది మేము సూచిస్తాము.'), 'h-guide') +
      '<ul class="guide">' + rows + '</ul></section>';
  }

  function qMessage() {
    var other = ($('#q-other') || {}).value || '', qty = ($('#q-qty') || {}).value || '', loc = ($('#q-loc') || {}).value || '', nm = ($('#q-name') || {}).value || '';
    var items = enquiry.map(function (id) { var p = byId[id]; return '- ' + p.name + ' (' + brandById[p.brand].name + ')'; });
    if (other.trim()) items.push('- ' + other.trim());
    var lines = [items.length ? 'Hello, I would like a price for:' : 'Hello, I would like a price for building materials.'].concat(items);
    if (qty.trim()) lines.push('Details: ' + qty.trim());
    if (loc.trim()) lines.push('Delivery to: ' + loc.trim());
    if (nm.trim()) lines.push('Name: ' + nm.trim());
    return lines.join('\n');
  }
  function renderQuoteList() {
    var ul = $('#q-list'); if (!ul) return;
    ul.innerHTML = enquiry.length ? enquiry.map(function (id) {
      var p = byId[id];
      return '<li><span class="q-item"><span class="q-thumb">' + thumb(p.shape, p.tint) + '</span><span><b>' + esc(lineName(p)) + '</b><br><small>' + esc(brandById[p.brand].name) + '</small></span></span>' +
        '<button type="button" class="btn-x" data-act="rm" data-id="' + id + '" aria-label="Remove ' + esc(p.name) + '">' + T('Remove', 'తీసివేయి') + '</button></li>';
    }).join('') : '<li class="q-empty">' + T('Nothing added yet. Open any product and press “Add to enquiry”, or type what you need below.', 'ఇంకా ఏదీ చేర్చలేదు. ఏదైనా ఉత్పత్తి తెరిచి “ఎంక్వైరీకి చేర్చు” నొక్కండి, లేదా కింద మీకు కావలసింది రాయండి.') + '</li>';
    updateQuote();
  }
  function updateQuote() {
    var m = qMessage(), pv = $('#q-preview'), send = $('#q-send');
    if (pv) pv.textContent = m;
    if (send) send.setAttribute('href', wa(m));
  }
  function secQuote() {
    return '<section class="sec sec-quote" id="quote" aria-labelledby="h-quote">' +
      sectionHead(T('Ask for today’s price', 'ఈ రోజు ధర అడగండి'), T('Rates change daily, so we quote on WhatsApp. Build your list and send it in one tap.', 'రేట్లు రోజూ మారతాయి, అందుకే WhatsAppలో చెబుతాం. జాబితా తయారుచేసి ఒక్క టచ్‌లో పంపండి.'), 'h-quote') +
      '<div class="q-grid"><div class="q-form">' +
      '<ul id="q-list" class="q-list"></ul>' +
      '<label class="fld"><span>' + T('Anything else you need', 'ఇంకా ఏమైనా కావాలా') + '</span><textarea id="q-other" rows="2" data-ph-en="e.g. 10 TMT bars, 2 buckets of paint" data-ph-te="ఉదా: 10 TMT కడ్డీలు, 2 పెయింట్ బకెట్లు"></textarea></label>' +
      '<label class="fld"><span>' + T('How much', 'ఎంత కావాలి') + '</span><input id="q-qty" type="text" autocomplete="off" data-ph-en="e.g. 100 bags" data-ph-te="ఉదా: 100 బస్తాలు"></label>' +
      '<div class="q-chips" role="group" aria-label="Quick quantity">' + ['10 bags', '50 bags', '100 bags', '1 truck load'].map(function (c) { return '<button type="button" class="chip chip-btn" data-act="qty" data-v="' + c + '">' + c + '</button>'; }).join('') + '</div>' +
      '<div class="q-two"><label class="fld"><span>' + T('Delivery place', 'ఎక్కడికి డెలివరీ') + '</span><input id="q-loc" type="text" autocomplete="off" data-ph-en="Village or area" data-ph-te="ఊరు లేదా ప్రాంతం"></label>' +
      '<label class="fld"><span>' + T('Your name', 'మీ పేరు') + '</span><input id="q-name" type="text" autocomplete="name" data-ph-en="Your name" data-ph-te="మీ పేరు"></label></div>' +
      '</div><aside class="q-side" aria-label="Message preview"><p class="q-cap">' + T('This message will open in WhatsApp', 'ఈ సందేశం WhatsAppలో తెరుచుకుంటుంది') + '</p>' +
      '<pre id="q-preview" class="q-preview"></pre>' +
      '<a id="q-send" class="btn btn-wa" href="#" target="_blank" rel="noopener">' + T('Send on WhatsApp', 'WhatsAppలో పంపండి') + '</a></aside></div></section>';
  }

  function secReviews() {
    return '<section class="sec sec-reviews" aria-labelledby="h-rev">' +
      sectionHead(T('Be one of our first Google reviewers', 'మా మొదటి Google రివ్యూ ఇచ్చేవారిలో మీరూ ఒకరు కండి'), T('If we served you well, a short review on Google helps the next customer find us.', 'మా సేవ నచ్చితే, Googleలో చిన్న రివ్యూ ఇస్తే తర్వాతి కస్టమర్ మమ్మల్ని సులభంగా కనుగొంటారు.'), 'h-rev') +
      '<div class="rv"><label class="fld"><span>' + T('Your review (optional draft)', 'మీ రివ్యూ (డ్రాఫ్ట్, ఐచ్ఛికం)') + '</span><textarea id="rv-text" rows="3" data-ph-en="Write a line or two, we copy it for you" data-ph-te="ఒకటి రెండు లైన్లు రాయండి, మేము కాపీ చేస్తాం"></textarea></label>' +
      '<div class="rv-act"><button type="button" class="btn btn-pri" data-act="review">' + T('Copy and open Google reviews', 'కాపీ చేసి Google రివ్యూ తెరువు') + '</button>' +
      '<a class="btn btn-ghost" href="' + GEN_URL + '" target="_blank" rel="noopener">' + T('Help me write it', 'రాయడంలో సహాయం చేయండి') + '</a></div></div></section>';
  }

  function secVisit() {
    return '<section class="sec sec-visit" aria-labelledby="h-visit">' +
      sectionHead(T('Visit the godown', 'గోడౌన్‌కి రండి'), T('Gunupudi, Bhimavaram. Look for the old VRL Transport premises on Simhadri Appanna Temple Street.', 'గుణుపూడి, భీమవరం. సింహాద్రి అప్పన్న దేవాలయ వీధిలో పాత VRL ట్రాన్స్‌పోర్ట్ ప్రాంగణం కోసం చూడండి.'), 'h-visit') +
      '<div class="visit"><address>' +
      '<p class="addr">18-10-3, Simhadri Appanna Temple Street,<br>Old VRL Transport Premises,<br>Gunupudi, Bhimavaram 534201</p>' +
      '<dl><dt>' + T('Open', 'సమయం') + '</dt><dd>7:30 AM – 7:30 PM</dd>' +
      '<dt>' + T('Phone and WhatsApp', 'ఫోన్, WhatsApp') + '</dt><dd><a href="tel:+' + PHONE + '">' + PHONE_SHOW + '</a></dd>' +
      '<dt>' + T('Contact', 'సంప్రదించండి') + '</dt><dd>Perumalla Ramu</dd>' +
      '<dt>Plus code</dt><dd>GGRG+FH Bhimavaram</dd></dl></address>' +
      '<div class="visit-act"><a class="btn btn-pri" href="' + DIR_URL + '" target="_blank" rel="noopener">' + T('Get directions', 'దారి చూపించు') + '</a>' +
      '<a class="btn btn-ghost" href="' + MAPS_URL + '" target="_blank" rel="noopener">' + T('Open in Google Maps', 'Google Mapsలో తెరువు') + '</a>' +
      '<a class="btn btn-ghost" href="tel:+' + PHONE + '">' + T('Call now', 'ఇప్పుడే కాల్ చేయండి') + '</a></div></div></section>';
  }

  /* ---------- views ---------- */
  var live = null;
  function cleanup() { if (live) { var p = live; live = null; p.then(function (h) { if (h && h.dispose) h.dispose(); }); } }

  var TAGS = [
    { en: 'Premium quality', te: 'ప్రీమియం క్వాలిటీ', ic: '<path d="M12 3l2.600 5.400 5.900.8-4.300 4.100 1 5.800L12 16.300 6.800 19.100l1-5.800L3.500 9.200l5.900-.8z"/>' },
    { en: 'High strength', te: 'అధిక బలం', ic: '<path d="M4 20V10m5 10V4m5 16V8m5 12V13M3 20h18"/>' },
    { en: 'Waterproof protection', te: 'వాటర్‌ప్రూఫ్ రక్షణ', ic: '<path d="M12 3c3.500 4.400 6 7.300 6 10.500a6 6 0 0 1-12 0C6 10.300 8.500 7.400 12 3z"/>' },
    { en: 'Trusted service', te: 'నమ్మకమైన సేవ', ic: '<path d="M12 3l7 3v5.500c0 4.500-3 7.800-7 9.500-4-1.700-7-5-7-9.500V6z"/><path d="M8.800 12.200l2.200 2.200 4.200-4.400"/>' }
  ];

  function heroItems() {
    var cementBrands = ['ultratech', 'ambuja', 'kcp', 'ramco', 'nagarjuna'];
    var bags = cementBrands.map(function (id) {
      var p = prodsOf(id, 'cement')[0]; if (!p) return null;
      var b = brandById[id];
      return { name: b.name, line: lineName(p), sub: subLine(p), tint: p.tint, mark: packMark(p), href: '#/b/' + id,
        label: '<b>' + esc(b.name) + '</b><small>' + T(plural(prodsOf(id).length, 'product', 'products'), prodsOf(id).length + ' ఉత్పత్తులు') + '</small>' };
    }).filter(Boolean);
    var spec = [
      { id: 'steel', brand: 'Steel', line: 'TMT bars', sub: '', shape: 'rebar', tint: 'slate' },
      { id: 'paint', brand: 'Paints', line: 'Interior & exterior', sub: 'Ask us', shape: 'can', tint: 'orange' },
      { id: 'chem', brand: 'Fosroc', line: 'Waterproofing', sub: 'Roof & bathroom', shape: 'pail', tint: 'teal' },
      { id: 'adhesive', brand: 'Fevicol', line: 'Adhesives', sub: 'Wood & tile', shape: 'bottle', tint: 'mustard' },
      { id: 'hardware', brand: 'Godrej', line: 'Locks', sub: 'Security', shape: 'padlock', tint: 'ink' },
      { id: 'white', brand: 'Birla White', line: 'WallCare Putty', sub: 'Wall finish', shape: 'sack', tint: 'white' }
    ];
    var items = spec.map(function (s) {
      var c = catById[s.id];
      return { id: s.id, shape: s.shape, tint: s.tint, brand: s.brand, line: s.line, sub: s.sub, href: '#/c/' + s.id, label: '<b>' + T(c.en, c.te) + '</b><small>' + (c.ask ? T('Ask us', 'అడగండి') : T('Open category', 'కేటగిరీ తెరువు')) + '</small>' };
    });
    return { bags: bags, items: items };
  }

  function viewHome() {
    var nb = C.BRANDS.length, np = C.PRODUCTS.length;
    app.innerHTML =
      '<section class="hero" aria-labelledby="hero-h"><div class="hero-in">' +
      '<div class="hero-copy">' +
      '<img class="hero-logo" src="assets/img/logo.png" width="390" height="315" alt="Pullayya Gari Cement Kottu">' +
      '<ul class="tags" aria-label="' + esc('Premium quality, High strength, Waterproof protection, Trusted service') + '">' + TAGS.map(function (t, i) {
        return '<li class="tag" style="--i:' + i + '"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + t.ic + '</svg><span>' + T(t.en, t.te) + '</span></li>';
      }).join('') + '</ul>' +
      '<h1 id="hero-h">' + T('A complete building solution', 'సంపూర్ణ నిర్మాణ పరిష్కారం') + '</h1>' +
      '<p class="lead">' + T(nb + ' brands and ' + np + ' products: cement, white cement, waterproofing, adhesives and locks under one roof in Gunupudi, Bhimavaram.', 'గుణుపూడి, భీమవరంలో ఒకే చోట ' + nb + ' బ్రాండ్లు, ' + np + ' ఉత్పత్తులు: సిమెంట్, వైట్ సిమెంట్, వాటర్‌ప్రూఫింగ్, అడ్హెసివ్స్, తాళాలు.') + '</p>' +
      '<div class="hero-cta"><a class="btn btn-pri" href="#/categories">' + T('Browse by category', 'కేటగిరీల వారీగా చూడండి') + '</a>' +
      '<a class="btn btn-wa" href="' + wa('Hello, I would like a price for building materials.') + '" target="_blank" rel="noopener">' + T('Ask for a price', 'ధర అడగండి') + '</a></div>' +
      '</div>' +
      '<div class="stage" id="stage"><div class="stage-gl" id="gl"></div><div class="hero-tip" id="tip" hidden></div>' +
      '<p class="stage-hint">' + T('Drag to turn the pallet. Tap a bag or an item to open it.', 'ప్యాలెట్‌ని లాగి తిప్పండి. బస్తా లేదా వస్తువుని తాకితే తెరుచుకుంటుంది.') + '</p></div>' +
      '</div><div class="ruler" aria-hidden="true"></div></section>' +
      secCategories() + secBrands() + secGuide() + secQuote() + secReviews() + secVisit();
    renderQuoteList();
    startHero();
  }

  function startHero() {
    var gl = $('#gl'), stage = $('#stage');
    var data = heroItems();
    function fallback() {
      stage.classList.add('no-gl');
      gl.innerHTML = '<ul class="shelf">' + data.bags.map(function (b) { return '<li><a href="' + b.href + '" style="--t:' + hex(b.tint) + '">' + thumb('bag', b.tint) + '<span>' + esc(b.name) + '</span></a></li>'; }).join('') +
        data.items.map(function (i) { return '<li><a href="' + i.href + '" style="--t:' + hex(i.tint) + '">' + thumb(i.shape, i.tint) + '<span>' + T(catById[i.id].en, catById[i.id].te) + '</span></a></li>'; }).join('') + '</ul>';
    }
    if (!window.PGScene || !PGScene.supported()) { fallback(); return; }
    live = PGScene.hero(gl, {
      reduced: REDUCED, tint: C.TINT, bags: data.bags, items: data.items, tooltip: $('#tip'),
      onNavigate: function (href) { location.hash = href; },
      onReady: function () { stage.classList.add('gl-on'); }
    }).catch(function (e) { fallback(); return null; });
  }

  function viewCategories() {
    app.innerHTML = '<div class="page">' + crumbs([homeCrumb, [T('Categories', 'కేటగిరీలు')]]) + '<h1 class="ph">' + T('Categories', 'కేటగిరీలు') + '</h1>' + secCategories() + '</div>';
  }

  function viewCategory(id) {
    var c = catById[id]; if (!c) return notFound();
    var brands = brandsIn(id);
    var body;
    if (!brands.length) {
      var msg = 'Hello, I would like to know which ' + c.en.toLowerCase() + ' brands you have.';
      body = '<div class="ask-box"><p>' + T('We are adding this brand list to the website. Tell us what you need and we will reply on WhatsApp with brands and today’s rates.', 'ఈ బ్రాండ్ల జాబితాను వెబ్‌సైట్‌లో చేరుస్తున్నాం. మీకు కావలసింది చెబితే బ్రాండ్లు, ఈ రోజు రేట్లతో WhatsAppలో బదులిస్తాం.') + '</p>' +
        '<a class="btn btn-wa" href="' + wa(msg) + '" target="_blank" rel="noopener">' + T('Ask on WhatsApp', 'WhatsAppలో అడగండి') + '</a></div>';
    } else {
      body = '<ul class="brand-rows">' + brands.map(function (b) {
        var ps = prodsOf(b.id, id);
        return '<li><a class="brow" href="#/b/' + b.id + '?c=' + id + '"><span class="brow-head"><span class="brow-name">' + esc(b.name) + '</span><span class="brow-te l-te" lang="te">' + esc(b.te) + '</span></span>' +
          '<span class="brow-by">' + esc(b.by) + '</span>' +
          '<span class="brow-list">' + ps.slice(0, 5).map(function (p) { return '<span class="chip">' + esc(lineName(p)) + '</span>'; }).join('') + (ps.length > 5 ? '<span class="chip chip-line">+' + (ps.length - 5) + '</span>' : '') + '</span>' +
          '<span class="brow-n">' + T(plural(ps.length, 'product', 'products'), ps.length + ' ఉత్పత్తులు') + '</span></a></li>';
      }).join('') + '</ul>';
    }
    app.innerHTML = '<div class="page" style="--t:' + hex(c.tint) + '">' + crumbs([homeCrumb, [T('Categories', 'కేటగిరీలు'), '#/categories'], [T(c.en, c.te)]]) +
      '<header class="cat-head"><div><h1 class="ph">' + T(c.en, c.te) + '</h1><p class="intro">' + T(c.introEn, c.introTe) + '</p></div><div class="cat-head-art">' + thumb(c.shape, c.tint, true) + '</div></header>' +
      body + '</div>';
  }

  function viewBrands() {
    app.innerHTML = '<div class="page">' + crumbs([homeCrumb, [T('Brands', 'బ్రాండ్లు')]]) + '<h1 class="ph">' + T('Brands', 'బ్రాండ్లు') + '</h1>' + secBrands() + '</div>';
  }

  function viewBrand(id, query) {
    var b = brandById[id]; if (!b) return notFound();
    var cats = catsOf(id), want = (/c=([a-z]+)/.exec(query || '') || [])[1];
    if (want && !cats.some(function (c) { return c.id === want; })) want = '';
    var chips = cats.length > 1 ? '<div class="filters" role="group" aria-label="Filter by category"><button type="button" class="chip chip-btn' + (!want ? ' on' : '') + '" data-act="bf" data-v="">' + T('All', 'అన్నీ') + '</button>' +
      cats.map(function (c) { return '<button type="button" class="chip chip-btn' + (want === c.id ? ' on' : '') + '" data-act="bf" data-v="' + c.id + '">' + T(c.en, c.te) + '</button>'; }).join('') + '</div>' : '';
    var groups = cats.map(function (c) {
      return '<section class="pgroup" data-cat="' + c.id + '"' + (want && want !== c.id ? ' hidden' : '') + '><h2>' + T(c.en, c.te) + '</h2><div class="pgrid">' + prodsOf(id, c.id).map(pcard).join('') + '</div></section>';
    }).join('');
    app.innerHTML = '<div class="page">' + crumbs([homeCrumb, [T('Brands', 'బ్రాండ్లు'), '#/brands'], [esc(b.name)]]) +
      '<header class="brand-head"><div><h1 class="ph">' + esc(b.name) + ' <span class="ph-te l-te" lang="te">' + esc(b.te) + '</span></h1><p class="by">' + esc(b.by) + '</p></div>' +
      '<div><p class="intro">' + T(b.en, b.tel) + '</p>' +
      '<a class="src" href="' + esc(b.site) + '" target="_blank" rel="noopener">' + T('Manufacturer’s website', 'తయారీదారు వెబ్‌సైట్') + '</a></div></header>' +
      chips + groups + '</div>';
  }

  function viewProduct(id) {
    var p = byId[id]; if (!p) return notFound();
    var b = brandById[p.brand], c = catById[p.cat], on = enquiry.indexOf(id) > -1;
    var specs = Object.keys(C.SPEC_LABELS).filter(function (k) { return p.specs && p.specs[k]; }).map(function (k) {
      return '<div><dt>' + T(C.SPEC_LABELS[k][0], C.SPEC_LABELS[k][1]) + '</dt><dd>' + esc(p.specs[k]) + '</dd></div>';
    }).join('');
    var apps = p.apps.filter(function (k) { return C.APPS[k]; }).map(function (k) { return '<li>' + T(C.APPS[k][0], C.APPS[k][1]) + '</li>'; }).join('');
    var related = prodsOf(p.brand).filter(function (q) { return q.id !== p.id; });
    related.sort(function (x, y) { return (y.cat === p.cat) - (x.cat === p.cat); });
    related = related.slice(0, 4);
    var msg = 'Hello, I would like a price for: ' + p.name + ' (' + b.name + ')';
    app.innerHTML = '<div class="page">' + crumbs([homeCrumb, [T(c.en, c.te), '#/c/' + c.id], [esc(b.name), '#/b/' + b.id + '?c=' + c.id], [esc(lineName(p))]]) +
      '<article class="prod" style="--t:' + hex(p.tint) + '">' +
      '<div class="prod-view"><div class="viewer" id="viewer"><div class="viewer-fb">' + thumb(p.shape, p.tint, true) + '</div></div>' +
      '<div class="viewer-ctl"><button type="button" class="chip chip-btn" data-act="turn" data-v="-0.6" aria-label="Turn left">&#8592;</button><span class="viewer-hint">' + T('Drag to turn the product', 'ఉత్పత్తిని లాగి తిప్పండి') + '</span><button type="button" class="chip chip-btn" data-act="turn" data-v="0.6" aria-label="Turn right">&#8594;</button></div>' +
      '<p class="viewer-note">' + T('A model drawn for this page, not the manufacturer’s pack design.', 'ఈ పేజీ కోసం గీసిన నమూనా, తయారీదారు ప్యాక్ డిజైన్ కాదు.') + '</p></div>' +
      '<div class="prod-info"><p class="by"><a href="#/b/' + b.id + '">' + esc(b.name) + '</a></p>' +
      '<h1 class="ph">' + esc(lineName(p)) + '</h1>' +
      '<p class="te-line l-te" lang="te">' + esc(p.te) + '</p>' +
      '<p class="desc">' + esc(p.desc) + '</p>' +
      (p.feats.length ? '<h2 class="mini">' + T('Why people choose it', 'ఎందుకు ఎంచుకుంటారు') + '</h2><ul class="feats">' + p.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' : '') +
      (apps ? '<h2 class="mini">' + T('Where to use it', 'ఎక్కడ వాడాలి') + '</h2><ul class="apps">' + apps + '</ul>' : '') +
      (specs ? '<h2 class="mini">' + T('Details', 'వివరాలు') + '</h2><dl class="specs">' + specs + '</dl>' : '') +
      '<div class="prod-act"><button type="button" class="btn btn-pri" data-act="add" data-id="' + p.id + '" aria-pressed="' + on + '">' + (on ? T('Added to enquiry', 'ఎంక్వైరీకి చేర్చబడింది') : T('Add to enquiry', 'ఎంక్వైరీకి చేర్చు')) + '</button>' +
      '<a class="btn btn-wa" href="' + wa(msg) + '" target="_blank" rel="noopener">' + T('Ask the price on WhatsApp', 'WhatsAppలో ధర అడగండి') + '</a></div>' +
      '<p class="fine">' + T('Product details are summarised from the manufacturer’s website. Pack sizes and availability can differ, so ask us before you order.', 'ఉత్పత్తి వివరాలు తయారీదారు వెబ్‌సైట్ నుండి సంగ్రహించినవి. ప్యాక్ సైజులు, లభ్యత మారవచ్చు, ఆర్డర్ ముందు మమ్మల్ని అడగండి.') + '</p>' +
      '</div></article>' +
      (related.length ? '<section class="sec sec-tight"><h2 class="mini">' + T('More from ' + b.name, b.te + ' నుండి మరిన్ని') + '</h2><div class="pgrid">' + related.map(pcard).join('') + '</div></section>' : '') + '</div>';

    var viewer = $('#viewer');
    if (window.PGScene && PGScene.supported()) {
      live = PGScene.product(viewer, {
        reduced: REDUCED, shape: p.shape, tintHex: hex(p.tint), brand: b.name, line: lineName(p), sub: subLine(p), mark: packMark(p),
        alt: 'Rotating 3D model of ' + p.name + '. Use the left and right arrow keys to turn it.',
        onReady: function () { viewer.classList.add('gl-on'); }
      }).catch(function () { return null; });
    }
  }

  var search = { text: '', cat: '' };
  function viewAll() {
    var chips = '<button type="button" class="chip chip-btn' + (!search.cat ? ' on' : '') + '" data-act="sf" data-v="">' + T('All', 'అన్నీ') + '</button>' +
      C.CATEGORIES.filter(function (c) { return !c.ask; }).map(function (c) { return '<button type="button" class="chip chip-btn' + (search.cat === c.id ? ' on' : '') + '" data-act="sf" data-v="' + c.id + '">' + T(c.en, c.te) + '</button>'; }).join('');
    app.innerHTML = '<div class="page">' + crumbs([homeCrumb, [T('All products', 'అన్ని ఉత్పత్తులు')]]) + '<h1 class="ph">' + T('All products', 'అన్ని ఉత్పత్తులు') + '</h1>' +
      '<div class="searchbar"><label class="fld"><span>' + T('Search by product, brand or use', 'ఉత్పత్తి, బ్రాండ్ లేదా వినియోగం ద్వారా వెతకండి') + '</span><input id="s-in" type="search" autocomplete="off" value="' + esc(search.text) + '" data-ph-en="e.g. putty, lock, PPC, tile adhesive" data-ph-te="ఉదా: putty, lock, PPC, tile adhesive"></label></div>' +
      '<div class="filters" id="s-chips" role="group" aria-label="Filter by category">' + chips + '</div>' +
      '<p class="count" id="s-count" role="status"></p><div class="pgrid" id="s-grid"></div></div>';
    runSearch();
    setLang(lang);
  }
  function runSearch() {
    var q = search.text.trim().toLowerCase();
    var res = C.PRODUCTS.filter(function (p) {
      if (search.cat && p.cat !== search.cat) return false;
      if (!q) return true;
      var hay = (p.name + ' ' + brandById[p.brand].name + ' ' + p.te + ' ' + catById[p.cat].en + ' ' + p.apps.map(function (k) { return C.APPS[k] ? C.APPS[k][0] : ''; }).join(' ')).toLowerCase();
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    });
    var g = $('#s-grid'), n = $('#s-count');
    if (!g) return;
    g.innerHTML = res.map(pcard).join('') || '<p class="none">' + T('No product matches. Try a shorter word, or ask us on WhatsApp.', 'సరిపోయే ఉత్పత్తి లేదు. చిన్న పదం ప్రయత్నించండి, లేదా WhatsAppలో అడగండి.') + '</p>';
    n.innerHTML = T(plural(res.length, 'product', 'products'), res.length + ' ఉత్పత్తులు');
    $$('#s-chips .chip').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === search.cat); });
  }

  function viewQuote() {
    app.innerHTML = '<div class="page">' + crumbs([homeCrumb, [T('Enquiry', 'ఎంక్వైరీ')]]) + '<h1 class="ph">' + T('Your enquiry', 'మీ ఎంక్వైరీ') + '</h1>' + secQuote() + '</div>';
    renderQuoteList();
  }
  function viewVisit() {
    app.innerHTML = '<div class="page">' + crumbs([homeCrumb, [T('Visit and reviews', 'సందర్శన, రివ్యూలు')]]) + '<h1 class="ph">' + T('Visit and reviews', 'సందర్శన, రివ్యూలు') + '</h1>' + secVisit() + secReviews() + '</div>';
  }
  function notFound() {
    app.innerHTML = '<div class="page"><h1 class="ph">' + T('We could not find that page', 'ఆ పేజీ దొరకలేదు') + '</h1><p><a class="btn btn-pri" href="#/">' + T('Go to the home page', 'హోమ్‌కి వెళ్లండి') + '</a></p></div>';
    return 'Page not found';
  }

  /* ---------- router ---------- */
  var firstRoute = true;
  function route() {
    cleanup();
    var h = location.hash.replace(/^#\/?/, ''), q = '';
    if (h.indexOf('?') > -1) { q = h.slice(h.indexOf('?') + 1); h = h.slice(0, h.indexOf('?')); }
    var parts = h.split('/').filter(Boolean), title = null, view = parts[0] || 'home';
    switch (view) {
      case 'home': viewHome(); break;
      case 'categories': viewCategories(); title = 'Categories'; break;
      case 'c': title = viewCategory(parts[1]) || (catById[parts[1]] && catById[parts[1]].en); break;
      case 'brands': viewBrands(); title = 'Brands'; break;
      case 'b': title = viewBrand(parts[1], q) || (brandById[parts[1]] && brandById[parts[1]].name); break;
      case 'p': title = viewProduct(parts[1]) || (byId[parts[1]] && byId[parts[1]].name); break;
      case 'all': viewAll(); title = 'All products'; break;
      case 'quote': viewQuote(); title = 'Your enquiry'; break;
      case 'visit': viewVisit(); title = 'Visit and reviews'; break;
      default: title = notFound();
    }
    document.title = title ? title + ' | ' + SITE : SITE + ': cement, waterproofing, adhesives and locks';
    document.body.setAttribute('data-view', view);
    $$('.nav a').forEach(function (a) {
      var k = a.getAttribute('data-nav'), cur = (k === view) || (k === 'categories' && view === 'c') || (k === 'brands' && view === 'b');
      if (cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    setLang(lang);
    saveEnq();
    window.scrollTo(0, 0);
    var focusEl = firstRoute ? null : $('#app h1'); firstRoute = false; if (focusEl) { focusEl.setAttribute('tabindex', '-1'); focusEl.focus({ preventScroll: true }); }
    if (view === 'all' && !parts[1]) { var si = $('#s-in'); if (si && search.text) si.setSelectionRange(si.value.length, si.value.length); }
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act'), v = t.getAttribute('data-v'), id = t.getAttribute('data-id');
    if (act === 'lang') { setLang(lang === 'te' ? 'en' : 'te'); return; }
    if (act === 'add') {
      var added = toggleEnq(id);
      t.setAttribute('aria-pressed', added);
      t.innerHTML = added ? T('Added to enquiry', 'ఎంక్వైరీకి చేర్చబడింది') : T('Add to enquiry', 'ఎంక్వైరీకి చేర్చు');
      toast(added ? 'Added to your enquiry' : 'Removed from your enquiry', added ? 'మీ ఎంక్వైరీకి చేర్చాం' : 'మీ ఎంక్వైరీ నుండి తీసివేశాం');
    } else if (act === 'rm') { toggleEnq(id); renderQuoteList(); }
    else if (act === 'qty') { var q = $('#q-qty'); if (q) { q.value = v; updateQuote(); q.focus(); } }
    else if (act === 'bf') {
      $$('.pgroup').forEach(function (g) { g.hidden = !!v && g.getAttribute('data-cat') !== v; });
      $$('.filters .chip').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); });
    } else if (act === 'sf') { search.cat = v; runSearch(); }
    else if (act === 'turn') { if (live) live.then(function (h) { if (h && h.turn) h.turn(parseFloat(v)); }); }
    else if (act === 'review') {
      var ta = $('#rv-text'), txt = ta ? ta.value.trim() : '';
      window.open(REVIEW_URL, '_blank', 'noopener');
      if (txt) copyText(txt).then(function () { toast('Review copied. Paste it on Google.', 'రివ్యూ కాపీ అయింది. Googleలో పేస్ట్ చేయండి.'); });
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 's-in') { search.text = e.target.value; runSearch(); }
    else if (/^q-/.test(e.target.id)) updateQuote();
  });
  function copyText(t) {
    function fb() { var a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(a); }
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).catch(fb);
    fb(); return Promise.resolve();
  }

  window.addEventListener('hashchange', route);
  setLang(lang);
  route();
})();
