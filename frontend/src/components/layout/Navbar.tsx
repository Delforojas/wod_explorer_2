import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthActions from "./AuthActions";
import DesktopNavigation from "./DesktopNavigation";
import MobileMenuButton from "./MobileMenuButton";
import MobileNavigation from "./MobileNavigation";

function Navbar() {
  useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    closeMobileMenu();
    navigate("/");
  }

  return (
    <nav className="site-navbar" aria-label="Navegación principal">
      <div className="navbar-header">
        <NavLink className="navbar-brand" to="/" onClick={closeMobileMenu}>
          WOD EXPLORER
        </NavLink>
        <DesktopNavigation isAuthenticated={isAuthenticated} />
        <div className="navbar-actions">
          <AuthActions
            className="desktop-auth-actions"
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          />
        </div>
      </div>
      {isMobileMenuOpen && (
        <MobileNavigation
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onNavigate={closeMobileMenu}
        />
      )}
    </nav>
  );
}

export default Navbar;
