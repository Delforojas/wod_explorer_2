import { NavLink } from "react-router-dom";

interface AuthActionsProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
}

function AuthActions({
  isAuthenticated,
  onLogout,
  onNavigate,
  className,
}: AuthActionsProps) {
  const classes = ["auth-actions", className].filter(Boolean).join(" ");

  if (!isAuthenticated) {
    return (
      <div className={classes}>
        <NavLink className="nav-link" to="/login" onClick={onNavigate}>
          Iniciar sesión
        </NavLink>
      </div>
    );
  }

  return (
    <div className={classes}>
      <span className="auth-user">Usuario</span>
      <button type="button" className="auth-logout" onClick={onLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default AuthActions;
