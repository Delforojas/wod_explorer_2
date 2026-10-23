const LINKEDIN_URL = "https://www.linkedin.com/in/delfinrojas/";
const GITHUB_URL = "https://github.com/Delforojas";
const PORTFOLIO_URL = "https://delforojas.es";
const EMAIL = "delfinrojasespina@email.com";

interface FooterProps {
  isAuthenticated: boolean;
}

function Footer({ isAuthenticated }: FooterProps) {
  return (
    <footer
      className={`site-footer delfo-footer ${
        isAuthenticated ? "delfo-footer--authenticated" : ""
      }`}
    >
      <div className="delfo-footer__aurora" aria-hidden="true" />
      <div className="delfo-footer__grid" aria-hidden="true" />

      <div className="delfo-footer__marquee">
        <div className="delfo-footer__marquee-track">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Delfín Rojas"
          >
            <img
              src="/icons/linkedin.svg"
              alt=""
              className="delfo-footer__social-icon"
            />
            <span>LINKEDIN</span>
          </a>

          <span aria-hidden="true">✦</span>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub de Delfín Rojas"
          >
            <img
              src="/icons/github.svg"
              alt=""
              className="delfo-footer__social-icon"
            />
            <span>GITHUB</span>
          </a>

          <span aria-hidden="true">✦</span>

          <a href={`mailto:${EMAIL}`} aria-label="Enviar email a Delfín Rojas">
            <img
              src="/icons/mail.svg"
              alt=""
              className="delfo-footer__social-icon"
            />
            <span>CONTACTO</span>
          </a>

          <span aria-hidden="true">✦</span>

          {/* Repetición para marquee infinito */}

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Delfín Rojas"
          >
            <img
              src="/icons/linkedin.svg"
              alt=""
              className="delfo-footer__social-icon"
            />
            <span>LINKEDIN</span>
          </a>

          <span aria-hidden="true">✦</span>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub de Delfín Rojas"
          >
            <img
              src="/icons/github.svg"
              alt=""
              className="delfo-footer__social-icon"
            />
            <span>GITHUB</span>
          </a>

          <span aria-hidden="true">✦</span>

          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Portfolio de Delfín Rojas"
          >
            <img
              src="/icons/glove.ico"
              alt=""
              className="delfo-footer__social-icon"
            />
            <span>PORTFOLIO</span>
          </a>

          <span aria-hidden="true">✦</span>

          <a href={`mailto:${EMAIL}`} aria-label="Enviar email a Delfín Rojas">
            <img
              src="/icons/mail.svg"
              alt=""
              className="delfo-footer__social-icon"
            />
            <span>CONTACTO</span>
          </a>

          <span aria-hidden="true">✦</span>
        </div>
      </div>

      <div className="delfo-footer__content">
        <p className="delfo-footer__tagline">ENTRENA. REGISTRA. SUPÉRATE.</p>
      </div>

      <div className="delfo-footer__bottom">
        <p className="delfo-footer__copyright">© 2026 DELFO</p>
      </div>
    </footer>
  );
}

export default Footer;
