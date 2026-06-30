import { useEffect, useRef } from "react";

/**
 * Film-grain + vignette overlay.
 *
 * Generates a tileable noise texture once on a small offscreen canvas, then
 * animates it as a fixed full-viewport layer for a cinematic, premium grain
 * (like igloo.inc / Awwwards-grade sites). Light on the GPU: one tiny canvas
 * blit + CSS steps animation.
 *
 * Disabled on reduced-motion.
 */
export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) {
      return undefined;
    }

    const size = 220;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const imageData = ctx.createImageData(size, size);
    const buffer = imageData.data;
    for (let i = 0; i < buffer.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      buffer[i] = v;
      buffer[i + 1] = v;
      buffer[i + 2] = v;
      buffer[i + 3] = 28;
    }
    ctx.putImageData(imageData, 0, 0);
    canvas.classList.add("is-active");
  }, []);

  return (
    <div className="film-grain" aria-hidden="true">
      <canvas ref={canvasRef} className="film-grain__canvas" />
      <div className="film-grain__vignette" />
    </div>
  );
}