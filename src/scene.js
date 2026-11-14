/*
 * 3D scenes for the site (Three.js). Everything is built in code: no model files. Hero labels carry the brand logo when one is passed in.
 * Bundled to assets/js/scene.js with:  npm run build
 *
 * PGScene.hero(container, opts)    3D logo with brand logos travelling on a helix around it (home page)
 * PGScene.product(container, spec) turntable viewer on a product page
 * PGScene.supported()              true when WebGL is available
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import LOGO_SHAPE from './logo-shape.js';

var INK = '#241E20';
var ORANGE = '#F58220';

/* ------------------------------------------------------------------ helpers */
function supported() {
  try {
    var c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

function fontsReady() {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  return Promise.all([
    document.fonts.load('800 40px Archivo'),
    document.fonts.load('500 40px Archivo')
  ]).catch(function () {});
}

function hexLum(hex) {
  var c = new THREE.Color(hex);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

function tex(canvas) {
  var t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function setFont(ctx, weight, px) {
  ctx.font = weight + ' ' + px + 'px Archivo, "Anek Telugu", sans-serif';
  try { ctx.fontStretch = 'condensed'; } catch (e) {}
}

function fit(ctx, text, maxW, startPx, weight) {
  var px = startPx;
  setFont(ctx, weight, px);
  while (ctx.measureText(text).width > maxW && px > 14) { px -= 2; setFont(ctx, weight, px); }
  return px;
}

function wrap(ctx, text, maxW) {
  var words = String(text).split(/\s+/), lines = [], cur = '';
  words.forEach(function (w) {
    var test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else { cur = test; }
  });
  if (cur) lines.push(cur);
  return lines;
}

function speckle(ctx, W, H, amount) {
  for (var i = 0; i < W * H * 0.012; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,' + amount + ')' : 'rgba(255,255,255,' + amount + ')';
    ctx.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}

/* Draw a brand logo (an already-loaded image) centred inside a white panel. */
function drawLogo(x, img, px, py, pw, ph) {
  x.fillStyle = '#ffffff'; x.fillRect(px, py, pw, ph);
  var iw = img.naturalWidth || img.width || 1, ih = img.naturalHeight || img.height || 1;
  var pad = Math.min(pw, ph) * 0.1, s = Math.min((pw - pad * 2) / iw, (ph - pad * 2) / ih);
  var w = iw * s, h = ih * s;
  x.drawImage(img, px + (pw - w) / 2, py + (ph - h) / 2, w, h);
}

function loadImg(url) {
  return new Promise(function (res) {
    if (!url) { res(null); return; }
    var im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = function () { res(im); }; im.onerror = function () { res(null); };
    im.src = url;
  });
}

/* Printed label: portrait for bags, wide for tubs and bottles. */
function labelCanvas(o, wide) {
  var W = wide ? 1024 : 512, H = wide ? 512 : 800;
  var c = document.createElement('canvas'); c.width = W; c.height = H;
  var x = c.getContext('2d');
  x.fillStyle = o.base; x.fillRect(0, 0, W, H);
  speckle(x, W, H, 0.05);
  var ink = hexLum(o.base) > 0.45 ? INK : '#ffffff';
  var cx = wide ? W / 2 : W / 2;
  var pw = wide ? 560 : W; // printed width
  var left = cx - pw / 2;

  if (!wide) {
    x.textAlign = 'center';
    var hb = o.logo ? 290 : 150; // a logo gets a big white panel so it reads from a distance
    if (o.logo) { drawLogo(x, o.logo, 0, 0, W, hb); }
    else {
      x.fillStyle = INK; x.fillRect(0, 0, W, 150);
      x.fillStyle = '#ffffff'; x.textBaseline = 'middle';
      fit(x, o.brand, W - 70, 96, 800);
      x.fillText(o.brand, cx, 78 + 4);
    }
    x.fillStyle = ORANGE; x.fillRect(0, hb, W, 14);
    x.fillStyle = ink; x.textBaseline = 'alphabetic';
    var np = 78; setFont(x, 800, np);
    var lines = wrap(x, o.name, W - 90);
    var maxL = o.logo ? 2 : 3;
    while (lines.length > maxL && np > 40) { np -= 6; setFont(x, 800, np); lines = wrap(x, o.name, W - 90); }
    var y = o.logo ? 400 : 330;
    lines.forEach(function (ln) { x.fillText(ln, cx, y); y += np * 1.05; });
    x.fillStyle = ink; x.globalAlpha = 0.85;
    setFont(x, 500, 34); x.fillText(o.sub || '', cx, y + 18);
    x.globalAlpha = 1;
    // stencil-style weight mark (skipped when the pack size is unknown)
    if (o.mark !== '') {
      x.strokeStyle = ink; x.lineWidth = 6; x.strokeRect(W / 2 - 120, H - 190, 240, 110);
      x.fillStyle = ink; setFont(x, 800, 74); x.fillText(o.mark || '50 KG', cx, H - 108);
    }
    x.fillStyle = INK; x.fillRect(0, H - 34, W, 34);
  } else {
    x.textAlign = 'center';
    if (o.logo) { drawLogo(x, o.logo, left, 40, pw, 150); }
    else {
      x.fillStyle = INK; x.fillRect(left, 70, pw, 120);
      x.fillStyle = '#ffffff'; x.textBaseline = 'middle';
      fit(x, o.brand, pw - 50, 84, 800); x.fillText(o.brand, cx, 134);
    }
    x.fillStyle = ORANGE; x.fillRect(left, 190, pw, 10);
    x.fillStyle = ink; x.textBaseline = 'alphabetic';
    var wp = 70; setFont(x, 800, wp);
    var wl = wrap(x, o.name, pw - 40);
    while (wl.length > 2 && wp > 36) { wp -= 6; setFont(x, 800, wp); wl = wrap(x, o.name, pw - 40); }
    var wy = 280; wl.forEach(function (ln) { x.fillText(ln, cx, wy); wy += wp * 1.05; });
    x.globalAlpha = 0.85; setFont(x, 500, 32); x.fillText(o.sub || '', cx, Math.min(wy + 10, 440)); x.globalAlpha = 1;
  }
  return c;
}

function labelTexture(o, wide) { return tex(labelCanvas(o, wide)); }

function blobShadow(size, strength) {
  var c = document.createElement('canvas'); c.width = c.height = 128;
  var x = c.getContext('2d');
  var g = x.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, 'rgba(0,0,0,' + (strength || 0.55) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  var m = new THREE.Mesh(new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.004;
  return m;
}

/* ------------------------------------------------------------------ geometry */
function bagGeometry(w, h, d) {
  var g = new THREE.BoxGeometry(w, h, d, 16, 24, 8);
  var pos = g.attributes.position;
  for (var i = 0; i < pos.count; i++) {
    var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    var u = x / (w / 2), v = y / (h / 2);
    var edge = Math.max(0, 1 - Math.pow(Math.abs(u), 4)) * Math.max(0, 1 - Math.pow(Math.abs(v), 5));
    pos.setZ(i, z * (0.16 + 0.84 * edge));
    pos.setX(i, x * (1 - 0.07 * Math.pow(Math.abs(v), 4)));
  }
  g.computeVertexNormals();
  return g;
}

function std(color, rough, metal) {
  return new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.8 : rough, metalness: metal || 0 });
}

function bagModel(o, dims) {
  var d = dims || { w: 1, h: 1.5, d: 0.34 };
  var g = new THREE.Group();
  var base = new THREE.Color(o.tintHex).getStyle();
  var front = std('#ffffff', 0.88); front.map = labelTexture({ base: o.tintHex, brand: o.brand, name: o.name, sub: o.sub, mark: o.mark, logo: o.logo }, false);
  var back = std('#ffffff', 0.88); back.map = labelTexture({ base: o.tintHex, brand: o.brand, name: o.name, sub: o.sub, mark: o.mark, logo: o.logo }, false);
  var side = std(o.tintHex, 0.9);
  var mesh = new THREE.Mesh(bagGeometry(d.w, d.h, d.d), [side, side, side, side, front, back]);
  g.add(mesh);
  var seam = new THREE.Mesh(new THREE.BoxGeometry(d.w * 0.9, 0.035, 0.05), std(INK, 0.9));
  seam.position.y = d.h / 2 - 0.05; g.add(seam);
  var seam2 = seam.clone(); seam2.position.y = -d.h / 2 + 0.05; g.add(seam2);
  return g;
}

function tubModel(o, opt) {
  var r = opt.r, h = opt.h, taper = opt.taper;
  var g = new THREE.Group();
  var side = std('#ffffff', 0.5); side.map = labelTexture({ base: o.tintHex, brand: o.brand, name: o.name, sub: o.sub, logo: o.logo }, true);
  var body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * taper, h, 64, 1, true, -Math.PI, Math.PI * 2), side);
  body.position.y = h / 2; g.add(body);
  var bottom = new THREE.Mesh(new THREE.CircleGeometry(r * taper, 48), std(o.tintHex, 0.6));
  bottom.rotation.x = Math.PI / 2; bottom.position.y = 0.002; g.add(bottom);
  var lidMat = std('#C7CBCF', 0.35, 0.7);
  var lid = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.01, r * 1.01, 0.05, 64), lidMat);
  lid.position.y = h + 0.02; g.add(lid);
  var rim = new THREE.Mesh(new THREE.TorusGeometry(r * 1.01, 0.028, 12, 64), lidMat);
  rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);
  var rim2 = rim.clone(); rim2.position.y = 0.02; rim2.scale.setScalar(taper); g.add(rim2);
  var handle = new THREE.Mesh(new THREE.TorusGeometry(r * 0.98, 0.016, 8, 48, Math.PI), std('#8C9196', 0.4, 0.8));
  handle.position.y = h; g.add(handle);
  return g;
}

function bottleModel(o) {
  var g = new THREE.Group();
  var pts = [[0, 0], [0.4, 0], [0.47, 0.06], [0.48, 0.5], [0.45, 0.78], [0.32, 0.98], [0.17, 1.08], [0.15, 1.2], [0.19, 1.24], [0.19, 1.3], [0.12, 1.34], [0.06, 1.72], [0.05, 1.8]]
    .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var body = new THREE.Mesh(new THREE.LatheGeometry(pts, 56), std(o.tintHex, 0.45));
  g.add(body);
  var tip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), std('#F2F2EE', 0.4));
  tip.position.y = 1.8; g.add(tip);
  var lab = std('#ffffff', 0.55); lab.map = labelTexture({ base: '#F4F2EC', brand: o.brand, name: o.name, sub: o.sub, logo: o.logo }, true);
  var band = new THREE.Mesh(new THREE.CylinderGeometry(0.486, 0.486, 0.44, 56, 1, true, -Math.PI, Math.PI * 2), lab);
  band.position.y = 0.32; g.add(band);
  return g;
}

function cartridgeModel(o) {
  var g = new THREE.Group();
  var side = std('#ffffff', 0.5); side.map = labelTexture({ base: o.tintHex, brand: o.brand, name: o.name, sub: o.sub, logo: o.logo }, true);
  var body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.35, 48, 1, true, -Math.PI, Math.PI * 2), side);
  body.position.y = 0.8; g.add(body);
  var pts = [[0.3, 1.475], [0.28, 1.5], [0.12, 1.75], [0.07, 2.05]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), std('#EDEDEA', 0.45)));
  var base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 40), std('#D9DCDF', 0.4, 0.3));
  base.position.y = 0.1; g.add(base);
  return g;
}

function padlockModel(o) {
  var g = new THREE.Group();
  var s = new THREE.Shape(), w = 1.0, h = 0.86, r = 0.2;
  s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  var geo = new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 18 });
  geo.translate(0, 0, -0.15);
  var brass = std('#C6A04A', 0.32, 0.9);
  var body = new THREE.Mesh(geo, brass); body.position.y = 0.45; g.add(body);
  var pts = [];
  pts.push(new THREE.Vector3(-0.3, 0.8, 0)); pts.push(new THREE.Vector3(-0.3, 1.1, 0));
  for (var i = 0; i <= 14; i++) { var a = Math.PI - (i / 14) * Math.PI; pts.push(new THREE.Vector3(Math.cos(a) * 0.3, 1.1 + Math.sin(a) * 0.3, 0)); }
  pts.push(new THREE.Vector3(0.3, 1.1, 0)); pts.push(new THREE.Vector3(0.3, 0.8, 0));
  var shackle = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1), 80, 0.07, 14, false), std('#DDE1E5', 0.2, 1));
  g.add(shackle);
  var plate = std('#ffffff', 0.5); plate.map = labelTexture({ base: '#241E20', brand: o.brand, name: '', sub: '', logo: o.logo }, true);
  var pl = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), plate);
  pl.position.set(0, 0.62, 0.205); g.add(pl);
  var hole = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 28), std('#111111', 0.6));
  hole.rotation.x = Math.PI / 2; hole.position.set(0, 0.28, 0.21); g.add(hole);
  var slot = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.14, 0.03), std('#111111', 0.6));
  slot.position.set(0, 0.2, 0.212); g.add(slot);
  return g;
}

function leverLockModel(o) {
  var g = new THREE.Group();
  var steel = std('#B9BDC3', 0.3, 0.9);
  var plate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.7, 0.06), steel); plate.position.y = 0.85; g.add(plate);
  var rose = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.1, 40), std('#2B2528', 0.4, 0.5));
  rose.rotation.x = Math.PI / 2; rose.position.set(0, 1.0, 0.08); g.add(rose);
  var path = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.0, 0.1), new THREE.Vector3(0, 1.0, 0.34), new THREE.Vector3(0.12, 1.0, 0.4), new THREE.Vector3(0.62, 1.0, 0.4)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(path, 40, 0.05, 14, false), std('#2B2528', 0.35, 0.6)));
  var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.08, 32), std('#C6A04A', 0.3, 0.9));
  cyl.rotation.x = Math.PI / 2; cyl.position.set(0, 0.42, 0.06); g.add(cyl);
  var slot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.02), std('#111', 0.6)); slot.position.set(0, 0.4, 0.105); g.add(slot);
  var pl = std('#ffffff', 0.5); pl.map = labelTexture({ base: '#241E20', brand: o.brand, name: '', sub: '', logo: o.logo }, true);
  var tag = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.23), pl); tag.position.set(0, 1.5, 0.034); g.add(tag);
  return g;
}

function blockModel(o) {
  var c = document.createElement('canvas'); c.width = c.height = 256;
  var x = c.getContext('2d'); x.fillStyle = '#E7E7E2'; x.fillRect(0, 0, 256, 256);
  for (var i = 0; i < 420; i++) { x.fillStyle = 'rgba(80,80,76,' + (0.08 + Math.random() * 0.18) + ')'; x.beginPath(); x.arc(Math.random() * 256, Math.random() * 256, 0.8 + Math.random() * 2.6, 0, 6.3); x.fill(); }
  var t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
  var m = std('#ffffff', 0.95); m.map = t;
  var g = new THREE.Group();
  var blk = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75, 0.6), m); blk.position.y = 0.375; g.add(blk);
  var top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75, 0.6), m); top.position.set(0.3, 1.1, 0.0); top.scale.set(0.5, 0.0001, 0.5); // keep silhouette simple
  var band = std('#ffffff', 0.6); band.map = labelTexture({ base: '#F58220', brand: o.brand, name: 'Cool Walls', sub: 'AAC block', mark: '' }, true);
  var plate = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), band); plate.position.set(0, 0.4, 0.302); g.add(plate);
  return g;
}

function rollModel(o) {
  var g = new THREE.Group();
  var roll = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.3, 48), std('#2B2B2E', 0.85, 0.05));
  roll.rotation.z = Math.PI / 2; roll.position.y = 0.42; g.add(roll);
  var lab = std('#ffffff', 0.7); lab.map = labelTexture({ base: o.tintHex, brand: o.brand, name: o.name, sub: o.sub, logo: o.logo }, true);
  var band = new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.425, 0.62, 48, 1, true, -Math.PI, Math.PI * 2), lab);
  band.rotation.z = Math.PI / 2; band.position.y = 0.42; g.add(band);
  return g;
}

function rebarModel() {
  var c = document.createElement('canvas'); c.width = 64; c.height = 128;
  var x = c.getContext('2d'); x.fillStyle = '#4A4E54'; x.fillRect(0, 0, 64, 128);
  x.strokeStyle = '#8B9097'; x.lineWidth = 3;
  for (var i = -2; i < 12; i++) { x.beginPath(); x.moveTo(0, i * 12 + 10); x.lineTo(64, i * 12); x.stroke(); }
  var t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1);
  var g = new THREE.Group();
  var rodMat = std('#ffffff', 0.55, 0.55); rodMat.map = t;
  var offs = [[0, 0], [-0.115, 0], [0.115, 0], [-0.0575, 0.1], [0.0575, 0.1], [-0.0575, -0.1], [0.0575, -0.1]];
  offs.forEach(function (p) {
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 2.3, 14), rodMat);
    rod.rotation.z = Math.PI / 2; rod.position.set(0, 0.11 + p[1] + 0.06, p[0]); g.add(rod);
    var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.05, 14), std(ORANGE, 0.5));
    cap.rotation.z = Math.PI / 2; cap.position.set(1.14, 0.17 + p[1], p[0]); g.add(cap);
  });
  var wire = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 8, 28), std('#222', 0.6, 0.4));
  wire.rotation.y = Math.PI / 2; wire.position.set(-0.4, 0.2, 0); g.add(wire);
  return g;
}

function palletModel(w, d) {
  var g = new THREE.Group(), wood = std('#A98A5F', 0.9), dark = std('#8B6D45', 0.95);
  for (var i = 0; i < 3; i++) { var s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, 0.16), dark); s.position.set(0, 0.045, -d / 2 + 0.1 + i * (d - 0.2) / 2); g.add(s); }
  for (var j = 0; j < 7; j++) { var p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, d), wood); p.position.set(-w / 2 + 0.25 + j * ((w - 0.5) / 6), 0.115, 0); g.add(p); }
  return g;
}

/* A sand heap: lumpy cone with a grainy texture, a shovel stuck in it and a price-on-request sign. */
function heapModel(o) {
  var base = '#B3854F';
  var c = document.createElement('canvas'); c.width = c.height = 256;
  var x = c.getContext('2d'); x.fillStyle = base; x.fillRect(0, 0, 256, 256);
  for (var i = 0; i < 2600; i++) {
    var k = Math.random();
    x.fillStyle = k < 0.5 ? 'rgba(60,40,20,' + (0.08 + Math.random() * 0.2) + ')' : 'rgba(255,245,220,' + (0.08 + Math.random() * 0.25) + ')';
    x.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  var t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2);
  var mat = std('#ffffff', 1); mat.map = t;
  // lumpy cone: lathe profile, then jitter the vertices a little
  var pts = [];
  for (var j = 0; j <= 12; j++) { var u = j / 12; pts.push(new THREE.Vector2(1.05 * (1 - Math.pow(u, 0.9)) + 0.0001, 0.85 * (1 - Math.pow(1 - u, 1.6)))); }
  var geo = new THREE.LatheGeometry(pts, 48), pos = geo.attributes.position;
  for (var v = 0; v < pos.count; v++) {
    var px = pos.getX(v), py = pos.getY(v), pz = pos.getZ(v), a = Math.atan2(pz, px);
    var n = 1 + 0.06 * Math.sin(a * 5 + py * 4) + 0.035 * Math.sin(a * 11);
    if (py > 0.01) { pos.setX(v, px * n); pos.setZ(v, pz * n); }
  }
  geo.computeVertexNormals();
  var g = new THREE.Group();
  var heap = new THREE.Mesh(geo, mat); heap.scale.set(1, 1, 0.8); g.add(heap);
  // shovel
  var wood = std('#8B6D45', 0.8), steel = std('#9DA3A8', 0.45, 0.6);
  var sh = new THREE.Group();
  var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 10), wood); handle.position.y = 0.5; sh.add(handle);
  var grip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.04), wood); grip.position.y = 1.0; sh.add(grip);
  var blade = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.02), steel); blade.position.y = -0.1; sh.add(blade);
  sh.position.set(0.32, 0.55, 0.12); sh.rotation.z = -0.45; sh.rotation.x = 0.15; g.add(sh);
  // sign on a stake
  var lab = std('#ffffff', 0.7); lab.map = labelTexture({ base: '#2B2528', brand: o.brand, name: o.name, sub: o.sub, logo: o.logo }, true);
  var sign = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.03), [wood, wood, wood, wood, lab, wood]);
  sign.position.set(-0.5, 0.7, 0.75); sign.rotation.y = 0.25; g.add(sign);
  var stake = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.04), wood); stake.position.set(-0.5, 0.3, 0.73); g.add(stake);
  return g;
}

/* One factory for every product shape. Returns a Group standing on y=0, ~2 units tall. */
function buildModel(shape, o) {
  var m;
  switch (shape) {
    case 'bag': m = bagModel(o); m.position.y = 0.75 + 0.0; break;
    case 'sack': m = bagModel(o, { w: 0.82, h: 1.1, d: 0.32 }); m.position.y = 0.55; break;
    case 'pail': m = tubModel(o, { r: 0.62, h: 0.98, taper: 0.88 }); break;
    case 'can': m = tubModel(o, { r: 0.52, h: 0.66, taper: 0.97 }); break;
    case 'bottle': m = bottleModel(o); break;
    case 'cartridge': m = cartridgeModel(o); break;
    case 'padlock': m = padlockModel(o); break;
    case 'mortise': m = leverLockModel(o); break;
    case 'block': m = blockModel(o); break;
    case 'roll': m = rollModel(o); break;
    case 'rebar': m = rebarModel(); break;
    case 'heap': m = heapModel(o); break;
    default: m = bagModel(o); m.position.y = 0.75;
  }
  var wrap = new THREE.Group(); wrap.add(m);
  return wrap;
}

function normalise(group, targetH) {
  var box = new THREE.Box3().setFromObject(group), size = new THREE.Vector3(); box.getSize(size);
  var s = targetH / Math.max(size.y, size.x * 0.8, size.z);
  group.scale.setScalar(s);
  box.setFromObject(group);
  group.position.x -= (box.min.x + box.max.x) / 2;
  group.position.z -= (box.min.z + box.max.z) / 2;
  group.position.y -= box.min.y;
  return group;
}

/* ------------------------------------------------------------------ renderer plumbing */
function makeRenderer(container) {
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;outline:none';
  container.appendChild(renderer.domElement);
  return renderer;
}

function addLights(scene, renderer) {
  scene.add(new THREE.HemisphereLight('#FFFFFF', '#6F7479', 1.05));
  var key = new THREE.DirectionalLight('#FFF3E2', 2.4); key.position.set(3.5, 6, 5); scene.add(key);
  var rim = new THREE.DirectionalLight('#9FC4FF', 0.9); rim.position.set(-5, 3, -4); scene.add(rim);
  try {
    var pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
  } catch (e) {}
}

function disposeAll(scene, renderer) {
  scene.traverse(function (o) {
    if (o.geometry) o.geometry.dispose();
    if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); }
  });
  if (scene.environment) scene.environment.dispose();
  renderer.dispose();
  try { renderer.forceContextLoss(); } catch (e) {}
  if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
}

/* Shared loop that pauses off-screen and when the tab is hidden. */
function makeLoop(container, tick) {
  var running = true, visible = true, raf = 0, last = performance.now();
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0.01 }) : null;
  if (io) io.observe(container);
  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    tick(dt, now / 1000);
  }
  raf = requestAnimationFrame(frame);
  return function stop() { running = false; cancelAnimationFrame(raf); if (io) io.disconnect(); };
}

/* ------------------------------------------------------------------ HERO */
function hero(container, opts) {
  opts = opts || {};
  var reduced = !!opts.reduced, disposed = false;
  var tip = opts.tooltip || null;
  var brands = (opts.brands || []).filter(function (b) { return b && b.logo; });
  var imgs = {};
  return Promise.all(brands.map(function (b) { return loadImg(b.logo).then(function (im) { imgs[b.logo] = im; }); })).then(function () {
    if (disposed) return { dispose: function () {} };
    var renderer = makeRenderer(container);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
    addLights(scene, renderer);
    var warm = new THREE.PointLight('#FF9A3C', 6, 9, 1.6); warm.position.set(0, 0.2, 2.2); scene.add(warm);
    var root = new THREE.Group(); scene.add(root);

    /* soft orange glow behind the logo */
    var gc = document.createElement('canvas'); gc.width = gc.height = 256;
    var gx = gc.getContext('2d'), gg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gg.addColorStop(0, 'rgba(245,130,32,0.55)'); gg.addColorStop(0.45, 'rgba(245,130,32,0.16)'); gg.addColorStop(1, 'rgba(245,130,32,0)');
    gx.fillStyle = gg; gx.fillRect(0, 0, 256, 256);
    var glow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), new THREE.MeshBasicMaterial({ map: tex(gc), transparent: true, depthWrite: false, toneMapped: false }));
    glow.position.z = -1.4; scene.add(glow);

    /* the logo, extruded from its traced outline */
    var logo = new THREE.Group();
    function extrude(list, depth, mat, z) {
      list.forEach(function (s) {
        var shape = new THREE.Shape(s.o.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
        s.h.forEach(function (h) { shape.holes.push(new THREE.Path(h.map(function (p) { return new THREE.Vector2(p[0], p[1]); }))); });
        var geo = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.012, bevelSegments: 2, curveSegments: 4 });
        var m = new THREE.Mesh(geo, mat); m.position.z = z; logo.add(m);
      });
    }
    extrude(LOGO_SHAPE.white, 0.26, new THREE.MeshStandardMaterial({ color: '#F4F1EC', roughness: 0.32, metalness: 0.08 }), -0.13);
    extrude(LOGO_SHAPE.orange, 0.2, new THREE.MeshStandardMaterial({ color: ORANGE, roughness: 0.3, metalness: 0.25, emissive: '#5A2400', emissiveIntensity: 0.25 }), -0.07);
    logo.scale.setScalar(1.5);
    var logoHolder = new THREE.Group(); logoHolder.add(logo); root.add(logoHolder);

    /* brand tiles travelling up a helix around the logo */
    var R = 2.75, HH = 5.0, TURNS = 2.0, N = brands.length;
    function helixAt(u) { var a = u * TURNS * Math.PI * 2; return new THREE.Vector3(Math.sin(a) * R, (u - 0.5) * HH, Math.cos(a) * R); }
    var path = [];
    for (var i = 0; i <= 240; i++) path.push(helixAt(i / 240));
    var helixLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(path), new THREE.LineDashedMaterial({ color: '#F58220', dashSize: 0.1, gapSize: 0.06, transparent: true, opacity: 0.7 }));
    helixLine.computeLineDistances(); root.add(helixLine);

    var tiles = brands.map(function (b, k) {
      var c = document.createElement('canvas'); c.width = 320; c.height = 160;
      var x = c.getContext('2d');
      x.fillStyle = '#ffffff'; x.beginPath();
      if (x.roundRect) x.roundRect(4, 4, 312, 152, 26); else x.rect(4, 4, 312, 152);
      x.fill(); x.lineWidth = 6; x.strokeStyle = '#C9A06A'; x.stroke();
      var im = imgs[b.logo];
      if (im) {
        var iw = im.naturalWidth || im.width || 1, ih = im.naturalHeight || im.height || 1, s = Math.min(256 / iw, 108 / ih);
        x.drawImage(im, 160 - iw * s / 2, 80 - ih * s / 2, iw * s, ih * s);
      }
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(c), transparent: true, depthWrite: false, toneMapped: false }));
      sp.userData = { u0: k / N, k: 1, b: b };
      root.add(sp);
      return sp;
    });

    var el = renderer.domElement;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Sri Rama Mohana Agencies logo in 3D, with the logos of the brands we stock circling it');
    var yaw = 0, vel = 0, dragging = false, moved = 0, lx = 0, hovered = null, flow = 0, ptr = { x: 0, y: 0 };

    function resize() {
      var w = container.clientWidth || 600, h = container.clientHeight || 500;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      var dist = 14.2 * Math.max(1, 0.95 / (w / h));
      camera.position.set(0, 3.4, dist); camera.lookAt(0, 0.1, 0); camera.updateProjectionMatrix();
    }
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container); else window.addEventListener('resize', resize);
    resize();

    var ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
    function pick(ev) {
      var r = el.getBoundingClientRect();
      v2.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(v2, camera);
      var hits = ray.intersectObjects(tiles.filter(function (t) { return t.material.opacity > 0.35; }), false);
      return hits.length ? hits[0].object : null;
    }
    function setHover(o) {
      if (o === hovered) return;
      hovered = o; el.style.cursor = o ? 'pointer' : 'grab';
      if (tip) { if (!o) tip.hidden = true; else { tip.hidden = false; tip.innerHTML = o.userData.b.label; } }
    }
    function onDown(ev) { dragging = true; moved = 0; lx = ev.clientX; vel = 0; try { el.setPointerCapture(ev.pointerId); } catch (e) {} }
    function onMove(ev) {
      var r = el.getBoundingClientRect();
      ptr.x = ((ev.clientX - r.left) / r.width) * 2 - 1; ptr.y = ((ev.clientY - r.top) / r.height) * 2 - 1;
      if (dragging) { var dx = ev.clientX - lx; moved += Math.abs(dx); lx = ev.clientX; yaw += dx * 0.008; vel = dx * 0.008; el.style.cursor = 'grabbing'; }
      else setHover(pick(ev));
    }
    function onUp(ev) {
      var wasDrag = moved > 6; dragging = false;
      try { el.releasePointerCapture(ev.pointerId); } catch (e) {}
      if (!wasDrag) { var o = pick(ev); if (o && opts.onNavigate) opts.onNavigate(o.userData.b.href); }
      el.style.cursor = hovered ? 'pointer' : 'grab';
    }
    function onLeave() { setHover(null); ptr.x = ptr.y = 0; }
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onDown); el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp); el.addEventListener('pointercancel', onUp); el.addEventListener('pointerleave', onLeave);

    var proj = new THREE.Vector3(), wp = new THREE.Vector3();
    function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
    function tick(dt, t) {
      if (!dragging) { yaw += vel; vel *= 0.93; }
      if (!reduced && !hovered) flow += dt * 0.035;
      root.rotation.y += (yaw + ptr.x * 0.18 - root.rotation.y) * 0.08;
      root.rotation.x += (ptr.y * 0.08 - root.rotation.x) * 0.08;
      // the logo turns gently on its own so the depth reads, but always faces front again
      logoHolder.rotation.y = -root.rotation.y + (reduced ? 0 : Math.sin(t * 0.6) * 0.38);
      logoHolder.position.y = reduced ? 0 : Math.sin(t * 0.9) * 0.06;
      tiles.forEach(function (sp) {
        var u = (sp.userData.u0 + flow) % 1;
        sp.position.copy(helixAt(u));
        sp.getWorldPosition(wp);
        var front = 0.5 + 0.5 * (wp.z / R);                       // 1 in front of the logo, 0 behind it
        var fade = smooth(0, 0.08, u) * (1 - smooth(0.92, 1, u));  // fade in at the bottom, out at the top
        sp.material.opacity = fade * (0.35 + 0.65 * front);
        var target = (sp === hovered ? 1.25 : 1) * (0.78 + 0.32 * front);
        sp.userData.k += (target - sp.userData.k) * 0.15;
        sp.scale.set(0.96 * sp.userData.k, 0.48 * sp.userData.k, 1);
        sp.renderOrder = front > 0.5 ? 2 : 0;
      });
      if (tip && hovered && !tip.hidden) {
        hovered.getWorldPosition(proj); proj.y += 0.35; proj.project(camera);
        tip.style.left = ((proj.x * 0.5 + 0.5) * container.clientWidth) + 'px';
        tip.style.top = ((-proj.y * 0.5 + 0.5) * container.clientHeight) + 'px';
      }
      renderer.render(scene, camera);
    }
    var stop = makeLoop(container, tick);
    tick(0, 0);
    if (opts.onReady) opts.onReady();

    return {
      dispose: function () {
        if (disposed) return; disposed = true;
        stop();
        el.removeEventListener('pointerdown', onDown); el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp); el.removeEventListener('pointercancel', onUp); el.removeEventListener('pointerleave', onLeave);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
        disposeAll(scene, renderer);
      }
    };
  });
}

/* ------------------------------------------------------------------ PRODUCT VIEWER */
function product(container, spec) {
  var reduced = !!spec.reduced, disposed = false;
  return fontsReady().then(function () {
    if (disposed) return { dispose: function () {} };
    var renderer = makeRenderer(container);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    addLights(scene, renderer);
    var root = new THREE.Group(); scene.add(root);

    var plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.8, 0.1, 72), new THREE.MeshStandardMaterial({ color: '#2f282a', roughness: 0.6, metalness: 0.2 }));
    plinth.position.y = -0.05; root.add(plinth);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.025, 8, 96), new THREE.MeshBasicMaterial({ color: ORANGE }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.0; root.add(ring);

    var holder = new THREE.Group(); root.add(holder);
    var model = buildModel(spec.shape, { tintHex: spec.tintHex, brand: spec.brand, name: spec.line, sub: spec.sub, mark: spec.mark });
    var big = (spec.shape === 'rebar' || spec.shape === 'roll' || spec.shape === 'block') ? 1.9 : 2.5;
    normalise(model, big);
    holder.add(model);

    var el = renderer.domElement; el.tabIndex = 0; el.setAttribute('role', 'img');
    el.setAttribute('aria-label', spec.alt || 'Rotating 3D model');
    var yaw = -0.5, vel = 0, tilt = 0.0, dragging = false, lx = 0, ly = 0, idle = 0;

    function resize() {
      var w = container.clientWidth || 500, h = container.clientHeight || 500;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      var dist = 8.6 * Math.max(1, 1.0 / (w / h));
      camera.position.set(0, 2.6, dist); camera.lookAt(0, 1.15, 0); camera.updateProjectionMatrix();
    }
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container); else window.addEventListener('resize', resize);
    resize();

    function onDown(ev) { dragging = true; idle = 0; lx = ev.clientX; ly = ev.clientY; vel = 0; el.style.cursor = 'grabbing'; try { el.setPointerCapture(ev.pointerId); } catch (e) {} }
    function onMove(ev) { if (!dragging) return; var dx = ev.clientX - lx, dy = ev.clientY - ly; lx = ev.clientX; ly = ev.clientY; yaw += dx * 0.01; vel = dx * 0.01; tilt = Math.max(-0.35, Math.min(0.35, tilt + dy * 0.004)); }
    function onUp(ev) { dragging = false; el.style.cursor = 'grab'; try { el.releasePointerCapture(ev.pointerId); } catch (e) {} }
    function onKey(ev) { if (ev.key === 'ArrowLeft') { yaw -= 0.25; idle = 0; ev.preventDefault(); } if (ev.key === 'ArrowRight') { yaw += 0.25; idle = 0; ev.preventDefault(); } }
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onDown); el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp); el.addEventListener('pointercancel', onUp); el.addEventListener('keydown', onKey);

    var stop = makeLoop(container, function (dt) {
      idle += dt;
      if (!dragging) { yaw += vel; vel *= 0.92; if (!reduced && idle > 1.2) yaw += dt * 0.5; }
      holder.rotation.y = yaw;
      root.rotation.x += (tilt - root.rotation.x) * 0.12;
      renderer.render(scene, camera);
    });
    renderer.render(scene, camera);
    if (spec.onReady) spec.onReady();

    return {
      dispose: function () {
        if (disposed) return; disposed = true; stop();
        el.removeEventListener('pointerdown', onDown); el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp); el.removeEventListener('pointercancel', onUp); el.removeEventListener('keydown', onKey);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
        disposeAll(scene, renderer);
      },
      turn: function (d) { yaw += d; idle = 0; }
    };
  });
}

export { hero, product, supported };
