import { useEffect, useRef } from "react";

/**
 * Blend cursor — a glowing gradient blob that trails the pointer with
 * inertia, grows near interactive elements, and inverts via mix-blend-mode.
 *
 * Auto-disables on touch + reduced-motion and hides the native cursor only
 * when active.
 */
export function BlendCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) {
      return undefined;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) {
      return undefined;
    }

    document.documentElement.classList.add("has-blend-cursor");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...mouse };
    const dotPos = { ...mouse };
    let hovering = false;
    let down = false;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      const target = event.target as HTMLElement | null;
      hovering = !!target?.closest(
        "a, button, input, textarea, select, [data-cursor='hover'], .work-card, .service-card, .value-card, .studio-stat, .hero-logo-intro__service, .contact-form__submit, .magnetic",
      );
    };

    const onDown = () => {
      down = true;
    };
    const onUp = () => {
      down = false;
    };
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const render = () => {
      // Dot snaps quickly
      dotPos.x += (mouse.x - dotPos.x) * 0.5;
      dotPos.y += (mouse.y - dotPos.y) * 0.5;
      // Ring trails with inertia
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;

      const scale = hovering ? 2.4 : down ? 0.7 : 1;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.setProperty("--cursor-hover", hovering ? "1" : "0");

      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("has-blend-cursor");
      if (frame) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div className="blend-cursor" aria-hidden="true">
      <div ref={ringRef} className="blend-cursor__ring" />
      <div ref={dotRef} className="blend-cursor__dot" />
    </div>
  );
}