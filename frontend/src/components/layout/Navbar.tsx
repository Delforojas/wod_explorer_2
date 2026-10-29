import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthActions from "./AuthActions";
import DesktopNavigation from "./DesktopNavigation";
import { useAuth } from "../../auth/useAuth";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, signOut } = useAuth();

  return (
    <header className="site-navbar">
      <div className="navbar-header">
        <NavLink className="navbar-brand" to="/">
          WOD EXPLORER
        </NavLink>

        <DesktopNavigation isAuthenticated={isAuthenticated} />

        <div className="navbar-actions">
          {isAuthenticated || location.pathname !== "/login" ? (
            <AuthActions
              className="desktop-auth-actions"
              isAuthenticated={isAuthenticated}
              username={username}
              onLogout={() => {
                signOut();
                navigate("/");
              }}
              withTextRoll
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
