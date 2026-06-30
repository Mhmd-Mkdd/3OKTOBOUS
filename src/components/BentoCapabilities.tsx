import { useRef } from "react";

type Tile = {
  title: string;
  desc: string;
  span?: string;
  accent: string;
  glyph: string;
};

const tiles: Tile[] = [
  {
    title: "Media & Photography",
    desc: "Cinematic commercial shoots, editorial, and post-production with obsessive craft.",
    span: "bento__tile--lg",
    accent: "linear-gradient(135deg,#00a0ff,#7e50ff)",
    glyph: "◉",
  },
  {
    title: "Video & Motion",
    desc: "Edits, color, sound, and motion graphics.",
    accent: "linear-gradient(135deg,#7e50ff,#fd00ff)",
    glyph: "▶",
  },
  {
    title: "Content Engine",
    desc: "Strategy-to-publishing pipelines tuned for every platform.",
    accent: "linear-gradient(135deg,#fd00ff,#ff6b35)",
    glyph: "◎",
  },
  {
    title: "Performance Marketing",
    desc: "Paid social, search, and analytics that compound.",
    accent: "linear-gradient(135deg,#ff6b35,#ffb800)",
    glyph: "◆",
  },
  {
    title: "Web Engineering",
    desc: "High-performance sites and web apps with motion built in.",
    span: "bento__tile--wide",
    accent: "linear-gradient(135deg,#00e0ff,#00a0ff)",
    glyph: "◇",
  },
  {
    title: "App Development",
    desc: "Native & cross-platform apps shipped end-to-end.",
    span: "bento__tile--wide",
    accent: "linear-gradient(135deg,#7e50ff,#00a0ff)",
    glyph: "▣",
  },
];

/**
 * BentoCapabilities — a responsive bento grid of service capabilities.
 * Each tile tilts in 3D toward the cursor with a parallax glow.
 */
export function BentoCapabilities() {
  return (
    <div className="bento">
      {tiles.map((tile) => (
        <BentoTile key={tile.title} tile={tile} />
      ))}
    </div>
  );
}

function BentoTile({ tile }: { tile: Tile }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 14;
    const rotX = -(py - 0.5) * 14;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) {
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    }
  };

  return (
    <article
      ref={ref}
      className={`bento__tile ${tile.span ?? ""}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="bento__glow" style={{ ["--bg" as string]: tile.accent }} aria-hidden="true" />
      <div className="bento__content">
        <span className="bento__glyph" aria-hidden="true">
          {tile.glyph}
        </span>
        <h3 className="bento__title">{tile.title}</h3>
        <p className="bento__desc">{tile.desc}</p>
      </div>
    </article>
  );
}