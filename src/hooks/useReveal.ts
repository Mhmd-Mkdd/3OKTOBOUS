import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic masked reveal — wraps each direct child (or word/letter when
 * `split` is set) in a mask and staggers it into view on scroll.
 *
 * Usage:
 *   const ref = useReveal<HTMLHeadingElement>();
 *   <h2 ref={ref} data-reveal>Heading</h2>
 */
export function useReveal<T extends HTMLElement>(split: "none" | "word" | "char" = "word") {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(el, { autoAlpha: 1, y: 0 });
        return;
      }

      // Collect target units
      let units: HTMLElement[] = [];

      if (split === "char") {
        const text = el.textContent ?? "";
        el.setAttribute("aria-label", text);
        el.textContent = "";
        text.split("").forEach((letter) => {
          if (letter === " ") {
            el.appendChild(document.createTextNode(" "));
            return;
          }
          const wrap = document.createElement("span");
          wrap.className = "reveal-unit reveal-char";
          wrap.textContent = letter;
          el.appendChild(wrap);
        });
        units = gsap.utils.toArray<HTMLElement>(".reveal-unit", el);
      } else if (split === "word") {
        const text = el.textContent ?? "";
        el.setAttribute("aria-label", text);
        el.textContent = "";
        text.split(" ").forEach((word, index, arr) => {
          const wrap = document.createElement("span");
          wrap.className = "reveal-unit reveal-word";
          const inner = document.createElement("span");
          inner.className = "reveal-unit__inner";
          inner.textContent = word;
          wrap.appendChild(inner);
          el.appendChild(wrap);
          if (index < arr.length - 1) {
            el.appendChild(document.createTextNode(" "));
          }
        });
        units = gsap.utils.toArray<HTMLElement>(".reveal-unit__inner", el);
      } else {
        el.classList.add("reveal-unit");
        units = [el];
      }

      gsap.set(units, { yPercent: 115 });

      gsap.to(units, {
        yPercent: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: split === "none" ? 0 : 0.045,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [split]);

  return ref;
}