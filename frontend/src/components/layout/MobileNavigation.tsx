import AuthActions from "./AuthActions";
import NavigationLinks from "./NavigationLinks";

import { mobilePrimaryNavigation, publicNavigation } from "./navigation";

interface MobileNavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

function MobileNavigation({
  isAuthenticated,
  onLogout,
}: MobileNavigationProps) {
  const navigationItems = isAuthenticated
    ? mobilePrimaryNavigation
    : publicNavigation;

  return (
    <nav
      className="mobile-navigation mobile-navigation-integrated"
      aria-label="Navegación móvil"
    >
      <NavigationLinks
        items={navigationItems}
        listClassName="mobile-nav-list"
      />

      {!isAuthenticated && (
        <AuthActions
          className="mobile-auth-actions"
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
        />
      )}
    </nav>
  );
}

export default MobileNavigation;
