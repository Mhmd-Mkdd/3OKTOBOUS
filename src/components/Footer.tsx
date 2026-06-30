export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__aurora" aria-hidden="true" />
      <div className="footer__inner">
        <div className="footer__brand">
          <a className="footer__logo" href="/" aria-label="Octopus home">
            Octopus
          </a>
          <p className="footer__tagline">
            Premium creative digital agency crafting media, video, photography,
            digital campaigns, websites, and apps.
          </p>
        </div>
        <div className="footer__nav">
          <div className="footer__col">
            <h4>Navigation</h4>
            <a href="#photography">Photography</a>
            <a href="#video-editing">Video</a>
            <a href="#studio">Studio</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer__col">
            <h4>Services</h4>
            <a href="#content-production">Content</a>
            <a href="#digital-marketing">Marketing</a>
            <a href="#web-development">Web</a>
            <a href="#app-development">Apps</a>
          </div>
          <div className="footer__col">
            <h4>Social</h4>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Twitter / X
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Behance
            </a>
          </div>
        </div>
      </div>
      <div className="footer__giant" aria-hidden="true">
        <span>Octopus</span>
      </div>
      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} Octopus. All rights reserved.</span>
        <span className="footer__credit">Crafted in Beirut · For brands built to move</span>
      </div>
    </footer>
  );
}