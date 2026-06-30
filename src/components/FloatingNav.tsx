import { useEffect, useState } from "react";

const links = [
  { id: "photography", label: "Photography" },
  { id: "video-editing", label: "Video" },
  { id: "content-production", label: "Content" },
  { id: "digital-marketing", label: "Marketing" },
  { id: "web-development", label: "Web" },
  { id: "app-development", label: "Apps" },
  { id: "studio", label: "Studio" },
  { id: "contact", label: "Contact" },
];

/**
 * FloatingNav — glassy pill nav that fades in after the hero intro, with a
 * scroll-progress spine on the right and active-section tracking.
 */
export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > window.innerHeight * 0.85);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, y / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries[0]) {
          setActive(visibleEntries[0].target.id);
        }
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: "-20% 0px -40% 0px" },
    );

    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className={`floating-nav ${visible ? "is-visible" : ""}`}>
        <a className="floating-nav__logo" href="/" aria-label="Octopus home">
          <span className="floating-nav__dot" aria-hidden="true" />
          Octopus
        </a>
        <nav className="floating-nav__links" aria-label="Section navigation">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? "is-active" : ""}
              onClick={(e) => handleClick(e, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="floating-nav__cta"
          href="#contact"
          onClick={(e) => handleClick(e, "contact")}
        >
          Start a Project
        </a>
      </header>

      <div
        className={`scroll-spine ${visible ? "is-visible" : ""}`}
        aria-hidden="true"
      >
        <div className="scroll-spine__track" />
        <div
          className="scroll-spine__progress"
          style={{ transform: `scaleY(${progress})` }}
        />
        <span className="scroll-spine__label">{Math.round(progress * 100)}</span>
      </div>
    </>
  );
}