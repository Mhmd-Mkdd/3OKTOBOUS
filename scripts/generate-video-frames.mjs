import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1920;
const HEIGHT = 1080;
const FRAME_COUNT = 150;
const OUT_DIR = path.resolve("public/video-frames");

const pad = (num) => String(num).padStart(4, "0");

function wavePath(frame, layer, complexity) {
  const phase = (frame / FRAME_COUNT) * Math.PI * 2;
  const points = [];

  const baseY = HEIGHT * 0.5 + (layer - 4) * 34;
  const amp1 = 70 + complexity * 80 + layer * 3;
  const amp2 = 22 + complexity * 60;
  const freq1 = 1.5 + complexity * 2.2;
  const freq2 = 4.5 + complexity * 5.5;

  for (let i = 0; i <= 140; i++) {
    const t = i / 140;
    const x = t * WIDTH;

    const braid =
      Math.sin(t * Math.PI * 2 * freq1 + phase + layer * 0.55) * amp1 +
      Math.sin(t * Math.PI * 2 * freq2 - phase * 1.35 + layer) * amp2 +
      Math.sin(t * Math.PI * 2 * 9 + phase * 0.7) * complexity * 18;

    const y = baseY + braid;

    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points.join(" ");
}

function smallParticles(frame) {
  const phase = frame / FRAME_COUNT;
  let svg = "";

  for (let i = 0; i < 90; i++) {
    const seed = i * 999;
    const x =
      ((Math.sin(seed * 12.9898) * 43758.5453 + phase * WIDTH * 0.25) %
        WIDTH +
        WIDTH) %
      WIDTH;
    const y =
      HEIGHT * 0.25 +
      ((Math.cos(seed * 78.233) * 43758.5453) % (HEIGHT * 0.5));
    const r = 0.8 + Math.abs(Math.sin(seed)) * 2.2;
    const opacity = 0.15 + Math.abs(Math.sin(phase * Math.PI * 2 + i)) * 0.35;

    svg += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}" fill="#ff3bd5" opacity="${opacity.toFixed(2)}" />`;
  }

  return svg;
}

function iconCutouts() {
  return `
    <mask id="ribbonCutouts">
      <rect width="100%" height="100%" fill="white"/>

      <!-- Play cutout -->
      <polygon points="380,460 380,620 530,540" fill="black"/>

      <!-- Pause cutout -->
      <rect x="930" y="455" width="48" height="170" rx="16" fill="black"/>
      <rect x="1010" y="455" width="48" height="170" rx="16" fill="black"/>

      <!-- Skip cutout -->
      <polygon points="1410,460 1410,620 1520,540" fill="black"/>
      <polygon points="1510,460 1510,620 1620,540" fill="black"/>
    </mask>
  `;
}

function iconGlows() {
  return `
    <polygon points="380,460 380,620 530,540" fill="none" stroke="#ff8cff" stroke-width="5" opacity="0.75"/>
    <rect x="930" y="455" width="48" height="170" rx="16" fill="none" stroke="#ff5bea" stroke-width="5" opacity="0.75"/>
    <rect x="1010" y="455" width="48" height="170" rx="16" fill="none" stroke="#ff5bea" stroke-width="5" opacity="0.75"/>
    <polygon points="1410,460 1410,620 1520,540" fill="none" stroke="#ff2aa8" stroke-width="5" opacity="0.75"/>
    <polygon points="1510,460 1510,620 1620,540" fill="none" stroke="#ff2aa8" stroke-width="5" opacity="0.75"/>
  `;
}

function makeSvg(frameIndex) {
  const frame = frameIndex - 1;
  const loopT = frame / FRAME_COUNT;
  const pulse = 0.5 + 0.5 * Math.sin(loopT * Math.PI * 2);
  const complexity = 0.25 + 0.75 * pulse;

  let thickRibbons = "";
  let thinLines = "";

  for (let layer = 0; layer < 9; layer++) {
    const path = wavePath(frame, layer, complexity);
    const opacity = 0.26 + layer * 0.035;
    const width = 34 + layer * 4;

    thickRibbons += `
      <path d="${path}"
        fill="none"
        stroke="url(#mainGradient)"
        stroke-width="${width}"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="${opacity.toFixed(2)}"
        filter="url(#softGlow)"
      />
    `;

    thinLines += `
      <path d="${path}"
        fill="none"
        stroke="url(#hotGradient)"
        stroke-width="${2 + (layer % 3)}"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.75"
      />
    `;
  }

  return `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="65%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#4d003b" stop-opacity="0.9"/>
        <stop offset="45%" stop-color="#190024" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#020006" stop-opacity="1"/>
      </radialGradient>

      <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b00ff"/>
        <stop offset="42%" stop-color="#b000ff"/>
        <stop offset="72%" stop-color="#ff149d"/>
        <stop offset="100%" stop-color="#ff2b6d"/>
      </linearGradient>

      <linearGradient id="hotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8f5cff"/>
        <stop offset="50%" stop-color="#ff4df3"/>
        <stop offset="100%" stop-color="#ff1b7b"/>
      </linearGradient>

      <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="strongGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="22" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      ${iconCutouts()}
    </defs>

    <rect width="100%" height="100%" fill="url(#bgGlow)"/>
    <rect width="100%" height="100%" fill="#020006" opacity="0.55"/>

    <g opacity="0.55" filter="url(#strongGlow)">
      ${smallParticles(frame)}
    </g>

    <g mask="url(#ribbonCutouts)">
      ${thickRibbons}
      ${thinLines}
    </g>

    <g filter="url(#softGlow)">
      ${iconGlows()}
    </g>

    <ellipse cx="1480" cy="540" rx="520" ry="230" fill="#ff0077" opacity="0.12" filter="url(#strongGlow)"/>
    <ellipse cx="560" cy="540" rx="500" ry="220" fill="#5d00ff" opacity="0.13" filter="url(#strongGlow)"/>
  </svg>
  `;
}

async function generate() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const svg = makeSvg(i);
    const outPath = path.join(OUT_DIR, `frame_${pad(i)}.jpg`);

    await sharp(Buffer.from(svg))
      .jpeg({
        quality: 88,
        mozjpeg: true,
      })
      .toFile(outPath);

    console.log(`Generated ${outPath}`);
  }

  console.log(`Done. Generated ${FRAME_COUNT} frames in ${OUT_DIR}`);
}

generate();