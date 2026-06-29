import { useCallback, useState } from "react";
import { CameraFrameSequence } from "./CameraFrameSequence";

const navLinks = ["Work", "Services", "Studio", "Contact"];
const services = [
  "Photography",
  "Video Editing",
  "Content Production",
  "Digital Marketing",
  "Web Development",
  "App Development",
];

export function Hero() {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const repeatedServices = [...services, ...services, ...services];
  const handleReady = useCallback(() => setIsReady(true), []);
  const handleLoadProgress = useCallback(
    (loaded: number, total: number) => setProgress((loaded / total) * 100),
    [],
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className={`hero-shell ${isReady ? "is-ready" : ""}`}>
      <div className="loader" aria-hidden={isReady}>
        <span>OCTOPUS</span>
        <div className="loader__bar">
          <i style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      <section className="hero" aria-label="Octopus creative digital agency">
        <div className="accent accent--cyan" />
        <div className="accent accent--violet" />
        <div className="accent accent--magenta" />

        <header className="hero-nav">
          <a className="hero-nav__logo" href="/" aria-label="Octopus home">
            Octopus
          </a>
          <nav
            className={`hero-nav__links ${menuOpen ? "hero-nav__links--open" : ""}`}
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <a
                href={`#${link.toLowerCase()}`}
                key={link}
                onClick={(e) => handleNavClick(e, `#${link.toLowerCase()}`)}
              >
                {link}
              </a>
            ))}
          </nav>
          <button
            className={`hero-nav__toggle ${menuOpen ? "hero-nav__toggle--active" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <div className="hero__content">
          <div className="hero__copy">
            <h1>We Create Systems That Move Brands Forward</h1>
            <p>
              Octopus is a premium creative digital agency crafting media, video,
              photography, digital campaigns, websites, and apps for brands that
              want to look impossible to ignore.
            </p>
            <div className="hero__actions" aria-label="Project actions">
              <a
                className="button button--primary"
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                Start a Project
              </a>
              <a className="button button--secondary" href="#showreel">
                <span className="button__play" aria-hidden="true" />
                Watch Showreel
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <CameraFrameSequence
              onReady={handleReady}
              onLoadProgress={handleLoadProgress}
            />
          </div>
        </div>

        <div className="service-marquee" aria-label="Octopus services">
          <div className="service-marquee__track">
            {repeatedServices.map((service, index) => (
              <span key={`${service}-${index}`}>{service}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}