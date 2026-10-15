import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthActions from "./AuthActions";
import DesktopNavigation from "./DesktopNavigation";
import { getAuthenticatedUsername } from "../../utils/auth";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const username = getAuthenticatedUsername();
  const isAuthenticated = Boolean(username);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

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
              onLogout={handleLogout}
              withTextRoll
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
