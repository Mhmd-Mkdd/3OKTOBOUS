import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Media Creation",
  "Video Editing",
  "Content Production",
  "Photography",
  "Digital Marketing",
  "Web Development",
  "App Development",
];

export function HeroLogoIntro() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      const nextSection = document.querySelector<HTMLElement>("#photography");
      const letters = gsap.utils.toArray<HTMLElement>(".hero-logo-intro__letter");

      gsap.set(".hero-logo-intro__word", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(letters, { autoAlpha: 0, y: 22, filter: "blur(12px)" });
      gsap.set(".hero-logo-intro__descriptor, .hero-logo-intro__service", {
        autoAlpha: 0,
        y: 18,
        filter: "blur(10px)",
      });

      if (nextSection) {
        gsap.set(nextSection, {
          autoAlpha: 0,
          y: 86,
          scale: 0.965,
          filter: "blur(18px)",
          clipPath: "inset(8% 3% 0% 3% round 30px)",
          transformOrigin: "50% 0%",
        });
      }

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".hero-logo-intro__mark-shell",
            ".hero-logo-intro__word",
            letters,
            ".hero-logo-intro__descriptor",
            ".hero-logo-intro__service",
            nextSection,
          ],
          {
            autoAlpha: 1,
            clearProps: "filter,clipPath,transform",
          },
        );
        return;
      }

      let introComplete = false;
      const introTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          introComplete = true;
        },
      });

      introTimeline
        .fromTo(
          ".hero-logo-intro__mark-shell",
          { autoAlpha: 0, scale: 0.72, y: 18, filter: "blur(18px)" },
          { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.82 },
        )
        .fromTo(
          ".hero-logo-intro__mark-image",
          { autoAlpha: 0, scale: 0.86, filter: "blur(10px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.58 },
          "-=0.44",
        )
        .to(
          ".hero-logo-intro__mark-shell",
          { x: "calc(-1 * clamp(22px, 5vw, 78px))", duration: 0.64 },
          "+=0.04",
        )
        .to(
          ".hero-logo-intro__word",
          { clipPath: "inset(0 0% 0 0)", duration: 0.78, ease: "expo.out" },
          "-=0.5",
        )
        .to(
          letters,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.52,
            stagger: 0.04,
          },
          "-=0.72",
        )
        .to(
          ".hero-logo-intro__descriptor, .hero-logo-intro__service",
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.58,
            stagger: 0.05,
          },
          "-=0.32",
        );

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=100%",
          scrub: 0.85,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (introComplete && self.progress <= 0.005) {
              gsap.set(
                [
                  root,
                  ".hero-logo-intro__brand-lockup",
                  ".hero-logo-intro__descriptor",
                  ".hero-logo-intro__service-row",
                  ".hero-logo-intro__service",
                ],
                {
                  autoAlpha: 1,
                  scale: 1,
                  y: 0,
                  yPercent: 0,
                  filter: "blur(0px)",
                },
              );
            }
          },
        },
        defaults: { ease: "none" },
      });

      scrollTimeline
        .fromTo(
          ".hero-logo-intro__service-row",
          { autoAlpha: 1, y: 0, filter: "blur(0px)" },
          { autoAlpha: 0, y: 18, filter: "blur(14px)", duration: 0.18, immediateRender: false },
          0,
        )
        .fromTo(
          ".hero-logo-intro__brand-lockup",
          { scale: 1, yPercent: 0, autoAlpha: 1, filter: "blur(0px)" },
          {
            scale: 8.8,
            yPercent: -4,
            autoAlpha: 0,
            filter: "blur(12px)",
            duration: 0.72,
            immediateRender: false,
          },
          0.08,
        )
        .fromTo(
          ".hero-logo-intro__descriptor",
          { autoAlpha: 1, y: 0, filter: "blur(0px)" },
          { autoAlpha: 0, y: -24, filter: "blur(12px)", duration: 0.24, immediateRender: false },
          0,
        )
        .fromTo(
          ".hero-logo-intro__transition-field",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.42, immediateRender: false },
          0.18,
        );

      if (nextSection) {
        scrollTimeline.to(
          nextSection,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 0.52,
          },
          0.33,
        );
      }

      scrollTimeline.fromTo(root, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.28, immediateRender: false }, 0.72);
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero-logo-intro"
      aria-label="Octopus cinematic brand intro"
    >
      <div className="hero-logo-intro__stage">
        <div className="hero-logo-intro__brand-lockup" aria-label="Octopus">
          <div className="hero-logo-intro__mark-shell">
            <img
              className="hero-logo-intro__mark-image"
              src="/octopus-logo-mark.png"
              alt="Octopus logo mark"
            />
          </div>
          <h1 className="hero-logo-intro__word" aria-label="Octopus">
            {"Octopus".split("").map((letter, index) => (
              <span className="hero-logo-intro__letter" aria-hidden="true" key={`${letter}-${index}`}>
                {letter}
              </span>
            ))}
          </h1>
        </div>

        <p className="hero-logo-intro__descriptor">
          Premium media, production, marketing, web, and app development for
          brands built to move with culture.
        </p>

        <div className="hero-logo-intro__service-row" aria-label="Octopus services">
          {services.map((service) => (
            <span className="hero-logo-intro__service" key={service}>
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-logo-intro__transition-field" aria-hidden="true" />
    </section>
  );
}
