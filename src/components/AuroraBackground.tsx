import { useEffect, useRef } from "react";

/**
 * AuroraBackground — the signature "living" brand background.
 *
 * A fixed, full-viewport canvas behind everything that renders a slow,
 * mouse-reactive aurora of the brand gradient (cyan → violet → magenta).
 * Hue and "breath" shift with scroll. Pure Canvas 2D (no WebGL deps).
 *
 * Disabled (hidden) on reduced-motion / coarse pointers.
 */
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    const mouse = { x: 0.5, y: 0.35 };
    const targetMouse = { x: 0.5, y: 0.35 };
    let scrollPhase = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointer = (e: PointerEvent) => {
      targetMouse.x = e.clientX / width;
      targetMouse.y = e.clientY / height;
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - height);
      scrollPhase = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const palette = [
      [0, 224, 255], // cyan
      [126, 80, 255], // violet
      [253, 0, 255], // magenta
    ];

    const render = (t: number) => {
      if (!running) return;

      // Slower, calmer easing for a more refined feel
      mouse.x += (targetMouse.x - mouse.x) * 0.035;
      mouse.y += (targetMouse.y - mouse.y) * 0.035;

      ctx.fillStyle = "#05030c";
      ctx.fillRect(0, 0, width, height);

      const time = t * 0.00012;
      ctx.globalCompositeOperation = "lighter";

      // Fewer, larger, softer blobs = calmer backdrop
      const blobs = 3;
      for (let i = 0; i < blobs; i += 1) {
        const phase = time + (i / blobs) * Math.PI * 2;
        const baseX = mouse.x * width;
        const baseY = mouse.y * height;
        const driftX = Math.cos(phase * 0.7 + i) * width * 0.38;
        const driftY = Math.sin(phase * 0.85 + i * 1.4) * height * 0.4;
        const x = baseX + driftX;
        const y = baseY + driftY + scrollPhase * (i % 2 === 0 ? 50 : -50);
        const r = Math.max(120, (0.46 + 0.12 * Math.sin(phase * 1.1)) * Math.min(width, height));

        const col = palette[i % palette.length];
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const intensity = 0.2 + 0.05 * Math.sin(phase * 1.6);
        g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${intensity})`);
        g.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},${intensity * 0.4})`);
        g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      // subtle vignette so content stays readable
      const vg = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75,
      );
      vg.addColorStop(0, "rgba(5,3,12,0)");
      vg.addColorStop(1, "rgba(5,3,12,0.72)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(render);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!reducedMotion) {
      raf = requestAnimationFrame(render);
    } else {
      render(0);
      running = false;
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else if (!reducedMotion) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="aurora-bg" aria-hidden="true" />;
}