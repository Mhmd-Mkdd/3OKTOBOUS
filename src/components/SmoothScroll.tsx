// SmoothScroll intentionally disabled.
//
// This project relies on GSAP ScrollTrigger `pin`, sticky/fixed elements, and
// canvas frame sequences driven by real scroll position. Transforming the
// <body> would desync those systems, so we keep native scrolling and instead
// deliver the "gliding" feel via scroll-linked easing in the visual layers
// (cursor, progress spine, parallax). This file remains as a no-op export so
// imports stay valid.
export function SmoothScroll() {
  return null;
}