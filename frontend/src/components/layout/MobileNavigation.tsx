import { useState } from "react";
import AuthActions from "./AuthActions";
import NavigationLinks from "./NavigationLinks";
import {
  mobileMoreNavigation,
  mobilePrimaryNavigation,
  publicNavigation,
} from "./navigation";

interface MobileNavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

function MobileNavigation({
  isAuthenticated,
  onLogout,
}: MobileNavigationProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const primaryNavigation = isAuthenticated ? mobilePrimaryNavigation : publicNavigation;

  function closeMoreMenu() {
    setIsMoreOpen(false);
  }

  return (
    <nav className="mobile-navigation" aria-label="Navegación móvil">
      <NavigationLinks
        items={primaryNavigation}
        listClassName="mobile-nav-list"
        onNavigate={closeMoreMenu}
      />
      {isAuthenticated && (
        <div className="mobile-more">
          <button
            type="button"
            className="mobile-more-button"
            aria-controls="mobile-more-menu"
            aria-expanded={isMoreOpen}
            onClick={() => setIsMoreOpen((isOpen) => !isOpen)}
          >
            <span className="mobile-more-icon" aria-hidden="true">...</span>
            <span>Más</span>
          </button>
          {isMoreOpen ? (
            <div id="mobile-more-menu" className="mobile-more-menu">
              <NavigationLinks
                items={mobileMoreNavigation}
                listClassName="mobile-more-list"
                onNavigate={closeMoreMenu}
              />
              <button type="button" className="mobile-more-close" onClick={closeMoreMenu}>
                Cerrar menú
              </button>
            </div>
          ) : null}
        </div>
      )}
      {!isAuthenticated ? (
        <AuthActions
          className="mobile-auth-actions"
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          onNavigate={closeMoreMenu}
        />
      ) : null}
    </nav>
  );
}

export default MobileNavigation;
