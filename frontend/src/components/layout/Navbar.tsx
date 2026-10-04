import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthActions from "./AuthActions";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

function Navbar() {
  useLocation();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("token"));

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
          <AuthActions
            className="desktop-auth-actions"
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        </div>
      </div>
      <MobileNavigation
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </header>
  );
}

export default Navbar;
