import { NavLink, useLocation } from "react-router-dom";
import TextRoll from "./TextRoll";
import UserMenu, { type UserMenuPlacement } from "./UserMenu";

interface AuthActionsProps {
  isAuthenticated: boolean;
  username?: string | null;
  onLogout: () => void;
  placement: UserMenuPlacement;
  onNavigate?: () => void;
  className?: string;
  withTextRoll?: boolean;
}

function AuthActions({
  isAuthenticated,
  username,
  onLogout,
  placement,
  onNavigate,
  className,
  withTextRoll = false,
}: AuthActionsProps) {
  const classes = ["auth-actions", className].filter(Boolean).join(" ");
  const location = useLocation();

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
      <UserMenu
        key={`${location.pathname}${location.search}${location.hash}`}
        username={username}
        onLogout={onLogout}
        placement={placement}
      />
    </div>
  );
}

export default AuthActions;
