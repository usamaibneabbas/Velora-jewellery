/**
 * VELORA product studio — renders product photography for pieces that do not
 * yet have product-only photographs. Loaded by scripts/render/index.html and
 * driven by scripts/render-products.mjs (headless Chromium).
 *
 * Everything is procedural: band texture, stones and plinth are drawn here.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/* ------------------------------------------------------------------ */
/* Random with a fixed seed so every render is identical               */
/* ------------------------------------------------------------------ */
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* ------------------------------------------------------------------ */
/* Cuff dimensions                                                     */
/* ------------------------------------------------------------------ */
const R = 1;
const H = 0.62;
const OPENING = 0.16;
const LEN = Math.PI * 2 * (1 - OPENING);
const START = Math.PI + (Math.PI * 2 * OPENING) / 2;
const TILES = 5;
const TILE_W = 2048;
const TILE_H = Math.round((TILE_W * H) / ((LEN * R) / TILES));

/* ------------------------------------------------------------------ */
/* Band tile — drawn three times: colour, height (bump), roughness     */
/* Layout is symmetric, with diamond motifs centred on both tile edges, */
/* so mirrored repetition is seamless.                                 */
/* ------------------------------------------------------------------ */
function drawBand(mode) {
  const c = document.createElement("canvas");
  c.width = TILE_W;
  c.height = TILE_H;
  const g = c.getContext("2d");
  const W = TILE_W;
  const Hh = TILE_H;
  const P = {
    color: { ground: "#202024", silver: ["#fbfaf7", "#d6d3cd", "#9a968f"], line: "#3a393d" },
    height: { ground: "#202020", silver: ["#ffffff", "#d0d0d0", "#a0a0a0"], line: "#303030" },
    rough: { ground: "#6e6e6e", silver: ["#4a4a4a", "#555555", "#606060"], line: "#808080" },
  }[mode];

  // Oxidised ground: mottled patina, fine grain and tiny hammer pits
  g.fillStyle = P.ground;
  g.fillRect(0, 0, W, Hh);
  seed = 11;
  for (let i = 0; i < 1400; i++) {
    const v = mode === "color" ? 40 + rand() * 30 : mode === "height" ? 30 + rand() * 20 : 110 + rand() * 60;
    g.fillStyle = `rgba(${v},${v},${v + (mode === "color" ? 6 : 0)},0.06)`;
    g.beginPath();
    g.ellipse(rand() * W, rand() * Hh, 20 + rand() * 90, 10 + rand() * 40, rand() * 3, 0, Math.PI * 2);
    g.fill();
  }
  for (let i = 0; i < 30000; i++) {
    const v = mode === "color" ? 25 + rand() * 45 : mode === "height" ? 10 + rand() * 50 : 120 + rand() * 60;
    g.fillStyle = `rgba(${v},${v},${v},0.45)`;
    g.fillRect(rand() * W, rand() * Hh, 1 + rand() * 3, 1 + rand() * 3);
  }

  const silverGrad = (y0, y1) => {
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, P.silver[2]);
    gr.addColorStop(0.45, P.silver[0]);
    gr.addColorStop(1, P.silver[1]);
    return gr;
  };

  // Plain silver borders top and bottom
  const rim = Hh * 0.075;
  g.fillStyle = silverGrad(0, rim);
  g.fillRect(0, 0, W, rim);
  g.fillStyle = silverGrad(Hh - rim, Hh);
  g.fillRect(0, Hh - rim, W, rim);

  // Fine engraved lines along the borders
  for (const y of [Hh * 0.205, Hh * 0.795]) {
    g.fillStyle = silverGrad(y - 9, y + 9);
    g.fillRect(0, y - 9, W, 18);
  }

  // Granulation — rows of tiny beads
  const bead = (x, y, r) => {
    const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    gr.addColorStop(0, P.silver[0]);
    gr.addColorStop(0.6, P.silver[1]);
    gr.addColorStop(1, P.silver[2]);
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  };
  const step = 30;
  for (const y of [Hh * 0.115, Hh * 0.155, Hh * 0.845, Hh * 0.885]) {
    for (let x = step / 2; x < W; x += step) bead(x, y, 11);
  }

  // Engraved diamond motifs, centred on both tile edges (and the middle is left for the lapis)
  const diamond = (cx, cy, w, h) => {
    g.save();
    g.beginPath();
    g.moveTo(cx, cy - h);
    g.lineTo(cx + w, cy);
    g.lineTo(cx, cy + h);
    g.lineTo(cx - w, cy);
    g.closePath();
    const gr = g.createLinearGradient(cx - w, cy - h, cx + w, cy + h);
    gr.addColorStop(0, P.silver[0]);
    gr.addColorStop(0.5, P.silver[1]);
    gr.addColorStop(1, P.silver[2]);
    g.fillStyle = gr;
    g.fill();
    g.clip();
    // Chased four-point star: alternating light and shadow facets
    const tips = [
      [cx, cy - h * 0.92],
      [cx + w * 0.92, cy],
      [cx, cy + h * 0.92],
      [cx - w * 0.92, cy],
    ];
    const inner = 0.22;
    tips.forEach((tip, i) => {
      const prev = tips[(i + 3) % 4];
      const next = tips[(i + 1) % 4];
      const mid = (p) => [cx + (p[0] - cx) * inner + (tip[0] - cx) * inner, cy + (p[1] - cy) * inner + (tip[1] - cy) * inner];
      for (const [side, shade] of [[prev, i % 2 ? 0 : 2], [next, i % 2 ? 2 : 0]]) {
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(tip[0], tip[1]);
        g.lineTo(...mid(side));
        g.closePath();
        g.fillStyle = P.silver[shade];
        g.fill();
      }
    });
    g.strokeStyle = P.line;
    g.lineWidth = 3;
    g.strokeRect(cx - w * 0.04, cy - h * 0.04, 0, 0);
    g.restore();
    // Beaded outline
    const n = 22;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const side = Math.floor(t * 4);
      const f = (t * 4) % 1;
      const pts = [
        [cx, cy - h * 1.18],
        [cx + w * 1.18, cy],
        [cx, cy + h * 1.18],
        [cx - w * 1.18, cy],
      ];
      const a = pts[side];
      const b = pts[(side + 1) % 4];
      bead(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 7);
    }
  };
  const dw = W * 0.085;
  const dh = Hh * 0.24;
  diamond(0, Hh / 2, dw, dh);
  diamond(W, Hh / 2, dw, dh);

  // Small chased leaves either side of each flower cluster
  for (const x of [W * 0.25, W * 0.75]) {
    for (const s of [-1, 1]) {
      g.save();
      g.translate(x, Hh / 2 + s * Hh * 0.2);
      g.scale(1, s);
      g.beginPath();
      g.moveTo(-34, 0);
      g.quadraticCurveTo(0, -26, 34, 0);
      g.quadraticCurveTo(0, 10, -34, 0);
      g.fillStyle = silverGrad(-26, 10);
      g.fill();
      g.restore();
    }
  }

  // Raised bezel seats beneath every 3D stone (height map only adds relief)
  if (mode !== "rough") {
    for (const s of STONES) {
      for (const u of s.mirror ? [s.u, 1 - s.u] : [s.u]) {
        bead(u * W, s.v * Hh, s.r * (TILE_W / ((LEN * R) / TILES)) * 1.18);
      }
    }
  }
  return c;
}

/* Stone positions in tile space (u across, v up), radius in world units */
const STONES = [
  { kind: "lapis", u: 0.5, v: 0.5, r: 0.105 },
  { kind: "coral", u: 0.0, v: 0.5, r: 0.022 },
  // turquoise flower clusters with coral centres
  ...[0.25].flatMap((u) => [
    { kind: "coral", u, v: 0.5, r: 0.02, mirror: true },
    { kind: "turq", u: u - 0.038, v: 0.5, r: 0.026, mirror: true },
    { kind: "turq", u: u + 0.038, v: 0.5, r: 0.026, mirror: true },
    { kind: "turq", u, v: 0.5 + 0.105, r: 0.026, mirror: true },
    { kind: "turq", u, v: 0.5 - 0.105, r: 0.026, mirror: true },
  ]),
];

/* ------------------------------------------------------------------ */
/* Stone surface textures                                              */
/* ------------------------------------------------------------------ */
function stoneTexture(kind) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  seed = kind === "lapis" ? 3 : 5;
  if (kind === "lapis") {
    const gr = g.createRadialGradient(220, 200, 20, 256, 256, 300);
    gr.addColorStop(0, "#2a44a8");
    gr.addColorStop(0.6, "#1b2f86");
    gr.addColorStop(1, "#0f1b55");
    g.fillStyle = gr;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(${15 + rand() * 35},${30 + rand() * 45},${100 + rand() * 100},0.22)`;
      g.beginPath();
      g.arc(rand() * 512, rand() * 512, 1 + rand() * 5, 0, Math.PI * 2);
      g.fill();
    }
    // calcite wisps
    g.strokeStyle = "rgba(205,214,235,0.16)";
    for (let i = 0; i < 6; i++) {
      g.lineWidth = 2 + rand() * 6;
      g.beginPath();
      let x = rand() * 512;
      let y = rand() * 512;
      g.moveTo(x, y);
      for (let k = 0; k < 6; k++) {
        x += (rand() - 0.5) * 120;
        y += (rand() - 0.3) * 60;
        g.lineTo(x, y);
      }
      g.stroke();
    }
    // pyrite flecks
    for (let i = 0; i < 420; i++) {
      g.fillStyle = `rgba(${210 + rand() * 40},${170 + rand() * 40},${80 + rand() * 40},${0.6 + rand() * 0.4})`;
      g.fillRect(rand() * 512, rand() * 512, 1 + rand() * 4, 1 + rand() * 4);
    }
  } else if (kind === "turq") {
    g.fillStyle = "#3cb3c6";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 500; i++) {
      g.fillStyle = `rgba(${40 + rand() * 50},${160 + rand() * 50},${180 + rand() * 40},0.4)`;
      g.beginPath();
      g.arc(rand() * 512, rand() * 512, 6 + rand() * 20, 0, Math.PI * 2);
      g.fill();
    }
  } else {
    g.fillStyle = "#b3302a";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 300; i++) {
      g.fillStyle = `rgba(${150 + rand() * 60},${30 + rand() * 30},${30 + rand() * 20},0.4)`;
      g.beginPath();
      g.arc(rand() * 512, rand() * 512, 6 + rand() * 18, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* Travertine plinth texture                                           */
/* ------------------------------------------------------------------ */
function travertine() {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const g = c.getContext("2d");
  seed = 19;
  g.fillStyle = "#d6c6aa";
  g.fillRect(0, 0, 2048, 1024);
  for (let i = 0; i < 90; i++) {
    const y = rand() * 1024;
    g.strokeStyle = `rgba(${150 + rand() * 50},${130 + rand() * 40},${100 + rand() * 30},${0.06 + rand() * 0.12})`;
    g.lineWidth = 1 + rand() * 10;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 2048; x += 128) g.lineTo(x, y + (rand() - 0.5) * 12);
    g.stroke();
  }
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(120,100,75,${0.08 + rand() * 0.2})`;
    g.beginPath();
    g.ellipse(rand() * 2048, rand() * 1024, 2 + rand() * 9, 1 + rand() * 3, 0, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */
class Edge extends THREE.Curve {
  constructor(r, y) {
    super();
    this.r = r;
    this.y = y;
  }
  getPoint(t, target = new THREE.Vector3()) {
    const a = START + t * LEN;
    return target.set(this.r * Math.sin(a), this.y, this.r * Math.cos(a));
  }
}

/** Hemisphere with planar (top-down) UVs — no pinching at the pole. */
const domeCache = new Map();
function domeGeometry(r) {
  if (domeCache.has(r)) return domeCache.get(r);
  const geo = new THREE.SphereGeometry(r, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / (2 * r) + 0.5, pos.getZ(i) / (2 * r) + 0.5);
  domeCache.set(r, geo);
  return geo;
}

/** Soft contact shadow under the piece. */
function contactShadow() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(128, 128, 30, 128, 128, 128);
  gr.addColorStop(0, "rgba(40,30,20,0.55)");
  gr.addColorStop(0.55, "rgba(40,30,20,0.25)");
  gr.addColorStop(1, "rgba(40,30,20,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = -H / 2 - 0.029;
  return m;
}

function buildCuff() {
  const group = new THREE.Group();
  const tex = (canvas, color) => {
    const t = new THREE.CanvasTexture(canvas);
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.MirroredRepeatWrapping;
    t.repeat.set(TILES, 1);
    t.anisotropy = 16;
    return t;
  };
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, H, 360, 1, true, START, LEN),
    new THREE.MeshPhysicalMaterial({
      map: tex(drawBand("color"), true),
      bumpMap: tex(drawBand("height")),
      bumpScale: 3,
      roughnessMap: tex(drawBand("rough")),
      roughness: 0.9,
      metalness: 1,
    }),
  );
  band.castShadow = band.receiveShadow = true;
  group.add(band);

  const silver = new THREE.MeshPhysicalMaterial({ color: "#e6e2dc", metalness: 1, roughness: 0.18 });
  const lining = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 0.965, R * 0.965, H * 0.98, 240, 1, true, START, LEN),
    new THREE.MeshPhysicalMaterial({ color: "#d8d4ce", metalness: 1, roughness: 0.3, side: THREE.BackSide }),
  );
  lining.castShadow = true;
  group.add(lining);
  for (const y of [H / 2, -H / 2]) {
    const rim = new THREE.Mesh(new THREE.TubeGeometry(new Edge(R * 0.99, y), 400, 0.03, 16, false), silver);
    rim.castShadow = true;
    group.add(rim);
  }
  for (const a of [START, START + LEN]) {
    const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.034, H, 8, 16), silver);
    cap.position.set(R * Math.sin(a), 0, R * Math.cos(a));
    group.add(cap);
  }

  // Stones: domed cabochons in silver bezels, placed along the band
  const mats = {
    lapis: new THREE.MeshPhysicalMaterial({ map: stoneTexture("lapis"), roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.3 }),
    turq: new THREE.MeshPhysicalMaterial({ map: stoneTexture("turq"), roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    coral: new THREE.MeshPhysicalMaterial({ map: stoneTexture("coral"), roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
  };
  const Y = new THREE.Vector3(0, 1, 0);
  const Z = new THREE.Vector3(0, 0, 1);
  const place = (s, u, tile) => {
    const a = START + ((tile + u) / TILES) * LEN;
    if (a < START + 0.02 || a > START + LEN - 0.02) return;
    const n = new THREE.Vector3(Math.sin(a), 0, Math.cos(a));
    const y = (s.v - 0.5) * H;
    const dome = new THREE.Mesh(domeGeometry(s.r), mats[s.kind]);
    dome.scale.set(1, s.kind === "lapis" ? 0.42 : 0.6, 1);
    dome.quaternion.setFromUnitVectors(Y, n);
    dome.position.copy(n.clone().multiplyScalar(R * 0.998)).setY(y);
    dome.castShadow = true;
    group.add(dome);
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(s.r * 1.04, s.r * (s.kind === "lapis" ? 0.09 : 0.16), 16, 96), silver);
    bezel.quaternion.setFromUnitVectors(Z, n);
    bezel.position.copy(n.clone().multiplyScalar(R * 1.002)).setY(y);
    group.add(bezel);
  };
  for (let tile = 0; tile <= TILES; tile++) {
    for (const s of STONES) {
      if (tile === TILES && s.u > 0) continue;
      // Mirrored tiles flip u; the layout is symmetric so both positions are filled.
      const us = s.mirror ? [s.u, 1 - s.u] : [s.u];
      for (const u of us) place(s, u, tile);
    }
  }
  return group;
}

function backdrop(top, bottom) {
  const c = document.createElement("canvas");
  c.width = 16;
  c.height = 1024;
  const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 1024);
  gr.addColorStop(0, top);
  gr.addColorStop(1, bottom);
  g.fillStyle = gr;
  g.fillRect(0, 0, 16, 1024);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* Shots                                                               */
/* ------------------------------------------------------------------ */
const SHOTS = {
  portrait: { w: 1600, h: 2000, fov: 25, cam: [2.7, 1.9, 5.3], look: [0, -0.18, 0], rotY: -0.5, bg: ["#efe8dc", "#d9cdb9"] },
  still: { w: 2000, h: 1520, fov: 24, cam: [0.4, 0.95, 4.9], look: [0, -0.12, 0], rotY: 0.32, bg: ["#ece4d6", "#d4c7b1"] },
  detail: { w: 2000, h: 1150, fov: 18, cam: [0.75, 0.5, 2.15], look: [0.05, -0.02, 0.85], rotY: 0, bg: ["#2a241e", "#14110e"] },
};

window.renderShot = async (name, scale = 1.5) => {
  const shot = SHOTS[name];
  const W = Math.round(shot.w * scale);
  const Hh = Math.round(shot.h * scale);
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, Hh, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = name === "detail" ? 1.1 : 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = backdrop(...shot.bg);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = name === "detail" ? 0.6 : 0.85;

  const cuff = buildCuff();
  cuff.rotation.y = shot.rotY;
  scene.add(cuff);

  // Travertine plinth
  const slab = new THREE.Mesh(
    new RoundedBoxGeometry(4.2, 0.32, 2.8, 6, 0.04),
    new THREE.MeshStandardMaterial({ map: travertine(), roughness: 0.85, metalness: 0 }),
  );
  slab.position.y = -H / 2 - 0.16 - 0.03;
  slab.receiveShadow = true;
  if (name !== "detail") scene.add(slab, contactShadow());

  // Light: warm key with soft shadow, cool rim, gentle fill
  const key = new THREE.SpotLight("#fff1dc", 60, 20, 0.55, 1, 2);
  key.position.set(-3, 4.2, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096);
  key.shadow.radius = 8;
  key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight("#dfe8ff", 1.6);
  rim.position.set(2.5, 2, -4);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight("#fff8ee", "#b8a88e", 0.5));

  const camera = new THREE.PerspectiveCamera(shot.fov, W / Hh, 0.1, 50);
  camera.position.set(...shot.cam);
  camera.lookAt(...shot.look);

  renderer.render(scene, camera);
  await new Promise((r) => requestAnimationFrame(r));
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  renderer.dispose();
  renderer.domElement.remove();
  return url;
};

window.studioReady = true;
