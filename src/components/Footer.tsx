export function Footer() {
  return (
    <footer className="footer">
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
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#studio">Studio</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer__col">
            <h4>Services</h4>
            <span>Photography</span>
            <span>Video Editing</span>
            <span>Content Production</span>
            <span>Web Development</span>
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
      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} Octopus. All rights reserved.</span>
      </div>
    </footer>
  );
}