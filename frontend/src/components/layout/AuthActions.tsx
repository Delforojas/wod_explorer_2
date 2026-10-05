import { NavLink } from "react-router-dom";
import TextRoll from "./TextRoll";

interface AuthActionsProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
  withTextRoll?: boolean;
}

function AuthActions({
  isAuthenticated,
  onLogout,
  onNavigate,
  className,
  withTextRoll = false,
}: AuthActionsProps) {
  const classes = ["auth-actions", className].filter(Boolean).join(" ");

  if (!isAuthenticated) {
    return (
      <div className={classes}>
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}
          to="/login"
          onClick={onNavigate}
          aria-label={withTextRoll ? "Iniciar sesión" : undefined}
        >
          {withTextRoll ? <TextRoll label="Iniciar sesión" /> : "Iniciar sesión"}
        </NavLink>
      </div>
    );
  }

  return (
    <div className={classes}>
      <span className="auth-user">Usuario</span>
      <button
        type="button"
        className="auth-logout"
        onClick={onLogout}
        aria-label={withTextRoll ? "Cerrar sesión" : undefined}
      >
        {withTextRoll ? <TextRoll label="Cerrar sesión" /> : "Cerrar sesión"}
      </button>
    </div>
  );
}

export default AuthActions;
