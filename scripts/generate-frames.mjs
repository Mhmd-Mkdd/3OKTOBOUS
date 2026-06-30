import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1920;
const HEIGHT = 1080;
const FRAME_COUNT = 120;
const PAD = 4;

const pad = (n) => String(n).padStart(PAD, "0");

/* ── Shared helpers ────────────────────────────────────────────── */

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function project3d(x, y, z, cx, cy) {
  // Simple perspective: shrink toward vanishing point as z rises.
  const scale = 620 / (620 + z);
  return {
    x: cx + x * scale,
    y: cy + y * scale,
    scale,
  };
}

function bgGradient(c1, c2, c3) {
  return `
    <radialGradient id="bg" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </radialGradient>`;
}

function glowFilter(id, std) {
  return `
    <filter id="${id}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="${std}" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
}

/* ── Scene 1: Video Editing — 3D film strip + timeline ─────────── */

function videoEditing(frame, total) {
  const t = frame / total;
  const angle = 38;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2 + 60;
  const stripCount = 5;

  const cells = [];
  const playheadX = lerp(-720, 720, t);

  for (let s = 0; s < stripCount; s++) {
    const zBase = (s - (stripCount - 1) / 2) * 150;
    const offset = Math.sin(t * Math.PI * 2 + s) * 40;
    const z = zBase + offset;

    // a row of cells per strip
    for (let i = 0; i < 7; i++) {
      const wx = (i - 3) * 150;
      const wy = 0;
      const p = project3d(wx, wy, z, cx, cy);
      const h = 120 * p.scale;
      const w = 120 * p.scale;
      const active = wx > playheadX - 60 && wx < playheadX + 60;
      const fill = active ? "#ff2bd6" : `#7e50ff`;
      const op = active ? 0.95 : 0.35 + s * 0.05;
      cells.push(
        `<rect x="${(p.x - w / 2).toFixed(1)}" y="${(p.y - h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(10 * p.scale).toFixed(1)}" fill="${fill}" opacity="${op.toFixed(2)}"/>`,
      );
    }
  }

  return {
    bg: bgGradient("#2a0040", "#15002a", "#04000c"),
    defs: `${glowFilter("g", 8)}${glowFilter("g2", 22)}
      <linearGradient id="ph" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff7bea"/>
        <stop offset="100%" stop-color="#ff1f8f"/>
      </linearGradient>`,
    body: `
      <g transform="rotate(${angle} ${cx} ${cy})">
        ${cells.join("\n        ")}
      </g>
      <rect x="${(cx + playheadX - 4).toFixed(1)}" y="${(cy - 360).toFixed(1)}" width="8" height="720" rx="4" fill="url(#ph)" filter="url(#g2)"/>
      <circle cx="${(cx + playheadX).toFixed(1)}" cy="${(cy - 360).toFixed(1)}" r="22" fill="#ff2bd6" filter="url(#g2)"/>
    `,
  };
}

/* ── Scene 2: Content Production — 3D stacked cascading layers ──── */

function contentProduction(frame, total) {
  const t = frame / total;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const layers = 7;
  const cards = [];

  for (let i = 0; i < layers; i++) {
    const phase = t * Math.PI * 2 + (i / layers) * Math.PI * 2;
    const z = (i - layers / 2) * 110 + Math.sin(phase) * 30;
    const rot = Math.sin(phase) * 16;
    const p = project3d(0, 0, z, cx, cy);
    const w = 760 * p.scale;
    const h = 440 * p.scale;
    const hue = ["#00d4ff", "#3a8bff", "#7e50ff", "#b04dff", "#fd2bd6", "#ff5b8c", "#ff8a3d"][i];
    const op = 0.85 - Math.abs(i - layers / 2) * 0.05;
    cards.push(
      `<g transform="translate(${cx} ${cy}) rotate(${rot.toFixed(1)}) translate(${-w / 2} ${-h / 2})">
        <rect width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="${(24 * p.scale).toFixed(0)}" fill="${hue}" opacity="${op.toFixed(2)}"/>
        <rect x="2" y="2" width="${(w - 4).toFixed(0)}" height="${(h - 4).toFixed(0)}" rx="${(22 * p.scale).toFixed(0)}" fill="none" stroke="white" stroke-opacity="0.18" stroke-width="2"/>
      </g>`,
    );
  }

  return {
    bg: bgGradient("#002a3a", "#001520", "#02060c"),
    defs: `${glowFilter("g", 10)}`,
    body: cards.join("\n        "),
  };
}

/* ── Scene 3: Digital Marketing — 3D rising growth chart ───────── */

function digitalMarketing(frame, total) {
  const t = frame / total;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2 + 120;
  const bars = 9;
  const elems = [];

  for (let i = 0; i < bars; i++) {
    const local = (i / bars + t) % 1;
    const z = (i - bars / 2) * 130;
    const p = project3d(0, 0, z, cx, cy);
    const h = (80 + local * 360) * p.scale;
    const w = 90 * p.scale;
    const x = cx + (i - bars / 2) * 130 * p.scale;
    const col = local > 0.7 ? "#ffd23d" : local > 0.4 ? "#ff6b35" : "#7e50ff";
    elems.push(
      `<rect x="${(x - w / 2).toFixed(1)}" y="${(cy - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(8 * p.scale).toFixed(1)}" fill="${col}" opacity="0.85" filter="url(#g)"/>`,
    );
    // glow node on top
    elems.push(
      `<circle cx="${x.toFixed(1)}" cy="${(cy - h).toFixed(1)}" r="${(10 * p.scale).toFixed(1)}" fill="white" opacity="0.9" filter="url(#g2)"/>`,
    );
  }

  return {
    bg: bgGradient("#2a1500", "#180a00", "#06030c"),
    defs: `${glowFilter("g", 8)}${glowFilter("g2", 16)}`,
    body: elems.join("\n        "),
  };
}

/* ── Scene 4: Web Development — 3D isometric wireframe mesh ────── */

function webDevelopment(frame, total) {
  const t = frame / total;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const cols = 12;
  const rows = 7;
  const lines = [];

  const iso = (gx, gy) => {
    const ix = (gx - gy) * 90;
    const iy = (gx + gy) * 52;
    return { x: cx + ix, y: cy + iy - 80 };
  };

  for (let gy = 0; gy < rows; gy++) {
    let path = "";
    for (let gx = 0; gx < cols; gx++) {
      const wave = Math.sin(gx * 0.6 + gy * 0.5 + t * Math.PI * 2) * 60;
      const p = iso(gx, gy);
      path += `${gx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${(p.y + wave).toFixed(1)} `;
    }
    lines.push(`<path d="${path}" fill="none" stroke="#2bd6ff" stroke-width="2" opacity="0.5"/>`);
  }
  for (let gx = 0; gx < cols; gx++) {
    let path = "";
    for (let gy = 0; gy < rows; gy++) {
      const wave = Math.sin(gx * 0.6 + gy * 0.5 + t * Math.PI * 2) * 60;
      const p = iso(gx, gy);
      path += `${gy === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${(p.y + wave).toFixed(1)} `;
    }
    lines.push(`<path d="${path}" fill="none" stroke="#7e50ff" stroke-width="2" opacity="0.45"/>`);
  }
  // nodes
  for (let gx = 0; gx < cols; gx++) {
    for (let gy = 0; gy < rows; gy++) {
      const wave = Math.sin(gx * 0.6 + gy * 0.5 + t * Math.PI * 2) * 60;
      const p = iso(gx, gy);
      const big = wave > 30;
      lines.push(
        `<circle cx="${p.x.toFixed(1)}" cy="${(p.y + wave).toFixed(1)}" r="${big ? 6 : 3}" fill="${big ? "#ff2bd6" : "#9bd"}" opacity="0.9"/>`,
      );
    }
  }

  return {
    bg: bgGradient("#001a2a", "#000e1a", "#02060c"),
    defs: `${glowFilter("g", 6)}`,
    body: lines.join("\n        "),
  };
}

/* ── Scene 5: App Development — 3D device morph ────────────────── */

function appDevelopment(frame, total) {
  const t = frame / total;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const angle = lerp(-22, 22, t);
  const scale = 1 + Math.sin(t * Math.PI * 2) * 0.06;

  // phone frame
  const phone = `
    <g transform="translate(${cx} ${cy}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)})">
      <rect x="-150" y="-330" width="300" height="660" rx="44" fill="#0c0820" stroke="#3a2a6a" stroke-width="4" filter="url(#g)"/>
      <rect x="-132" y="-300" width="264" height="600" rx="32" fill="url(#screen)"/>
      ${Array.from({ length: 4 }, (_, i) => {
        const yy = -250 + i * 150 + (Math.sin(t * Math.PI * 2 + i) * 10);
        return `<rect x="-100" y="${yy.toFixed(0)}" width="200" height="${(60 + Math.sin(t * Math.PI * 4 + i) * 20).toFixed(0)}" rx="14" fill="#7e50ff" opacity="${(0.6 - i * 0.08).toFixed(2)}"/>`;
      }).join("\n      ")}
      <circle cx="0" cy="-300" r="8" fill="#2a1a4a"/>
    </g>`;

  // orbiting particles
  const orbs = Array.from({ length: 16 }, (_, i) => {
    const a = t * Math.PI * 2 + (i / 16) * Math.PI * 2;
    const r = 460 + Math.sin(t * Math.PI * 4 + i) * 40;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.5;
    const col = i % 2 === 0 ? "#ff2bd6" : "#2bd6ff";
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${col}" filter="url(#g2)"/>`;
  }).join("\n      ");

  return {
    bg: bgGradient("#1a0040", "#0c0020", "#04000c"),
    defs: `${glowFilter("g", 12)}${glowFilter("g2", 18)}
      <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a0a3a"/>
        <stop offset="100%" stop-color="#3a0a2a"/>
      </linearGradient>`,
    body: `${phone}\n      ${orbs}`,
  };
}

/* ── Orchestrator ──────────────────────────────────────────────── */

const scenes = {
  "video-frames": videoEditing,
  "content-frames": contentProduction,
  "marketing-frames": digitalMarketing,
  "web-frames": webDevelopment,
  "app-frames": appDevelopment,
};

function makeSvg(scene) {
  return `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${scene.defs}
      ${scene.bg}
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="#020006" opacity="0.35"/>
    ${scene.body}
  </svg>`;
}

async function generateScene(name, fn) {
  const outDir = path.resolve("public", name);
  await fs.mkdir(outDir, { recursive: true });

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const scene = fn(i, FRAME_COUNT);
    const svg = makeSvg(scene);
    const outPath = path.join(outDir, `frame_${pad(i)}.jpg`);
    await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(outPath);
  }
  console.log(`✓ ${name}: ${FRAME_COUNT} frames`);
}

async function main() {
  const target = process.argv[2];
  if (target && scenes[target]) {
    await generateScene(target, scenes[target]);
    return;
  }
  for (const [name, fn] of Object.entries(scenes)) {
    await generateScene(name, fn);
  }
  console.log("All scenes generated.");
}

main();