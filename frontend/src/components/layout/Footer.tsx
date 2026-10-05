import { useRef } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    footerRef.current?.style.setProperty("--footer-light-x", `${event.clientX - bounds.left}px`);
    footerRef.current?.style.setProperty("--footer-light-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <footer
      ref={footerRef}
      className="site-footer delfo-footer"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => footerRef.current?.style.removeProperty("--footer-light-x")}
    >
      <div className="delfo-footer__top">
        <div>
          <p className="delfo-footer__brand">delfo</p>
          <p className="delfo-footer__description">Explora entrenamientos, crea tus WODs y registra tu progreso.</p>
        </div>
        <div>
          <p className="delfo-footer__heading">Explorar</p>
          <nav aria-label="Enlaces del footer">
            <ul className="delfo-footer__links">
              <li><Link to="/exercises">Ejercicios</Link></li>
              <li><Link to="/wods">WODs</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="delfo-footer__bottom">
        <p className="delfo-footer__copyright">© 2026 delfo</p>
        <svg className="delfo-footer__wordmark" viewBox="0 0 1000 180" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="delfo-pointer-light" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e88e5" stopOpacity="0" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <text className="delfo-footer__wordmark-base" x="0" y="145">DELFO</text>
          <text className="delfo-footer__wordmark-light" x="0" y="145">DELFO</text>
        </svg>
      </div>
    </footer>
  );
}

export default Footer;
