import { useEffect, useRef } from "react";

/**
 * 3D spotlight tilt — rotates the element toward the pointer and drives a
 * radial spotlight via the CSS custom properties --mx / --my.
 *
 * Disabled automatically on touch devices and when the user prefers reduced
 * motion.
 */
export function useTilt<T extends HTMLElement>(strength = 12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) {
      return undefined;
    }

    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      const rotY = (px - 0.5) * strength;
      const rotX = (0.5 - py) * strength;

      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${rotY.toFixed(2)}deg`);
        el.style.setProperty("--ry", `${rotX.toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
      });
    };

    const handleEnter = () => {
      el.style.setProperty("--tilt-active", "1");
    };

    const handleLeave = () => {
      el.style.setProperty("--tilt-active", "0");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("pointerenter", handleEnter);
    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      el.removeEventListener("pointerenter", handleEnter);
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [strength]);

  return ref;
}