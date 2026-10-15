import { NavLink } from "react-router-dom";
import TextRoll from "./TextRoll";

interface AuthActionsProps {
  isAuthenticated: boolean;
  username?: string | null;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
  withTextRoll?: boolean;
}

function AuthActions({
  isAuthenticated,
  username,
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
          className={({ isActive }) =>
            `nav-link${isActive ? " nav-link-active" : ""}`
          }
          to="/login"
          onClick={onNavigate}
          aria-label={withTextRoll ? "Iniciar sesión" : undefined}
        >
          {withTextRoll ? (
            <TextRoll label="Iniciar sesión" />
          ) : (
            "Iniciar sesión"
          )}
        </NavLink>
      </div>
    );
  }

  return (
    <div className={classes}>
      {username && <span className="auth-user">{username}</span>}

      <button
        type="button"
        className="auth-logout"
        onClick={onLogout}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
      ></button>
    </div>
  );
}

export default AuthActions;
