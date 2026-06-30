import { useEffect, useRef } from "react";

/**
 * Magnetic pull — the element drifts toward the pointer when it enters a
 * configurable radius and springs back on leave.
 *
 * Disabled on touch devices and reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>(radius = 90, pull = 0.35) {
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
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance > radius) {
        if (frame) {
          cancelAnimationFrame(frame);
        }
        frame = requestAnimationFrame(() => {
          el.style.transform = "translate3d(0,0,0)";
        });
        return;
      }

      const moveX = dx * pull;
      const moveY = dy * pull;

      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
      });
    };

    const handleLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        el.style.transform = "translate3d(0,0,0)";
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [radius, pull]);

  return ref;
}