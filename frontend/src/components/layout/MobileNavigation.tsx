import NavigationLinks from "./NavigationLinks";

import { mobilePrimaryNavigation, publicNavigation } from "./navigation";

interface MobileNavigationProps {
  isAuthenticated: boolean;
}

function MobileNavigation({ isAuthenticated }: MobileNavigationProps) {
  const navigationItems = isAuthenticated
    ? mobilePrimaryNavigation
    : publicNavigation;

  return (
    <nav
      className={`mobile-navigation mobile-navigation-integrated mobile-navigation-items-${navigationItems.length}`}
      aria-label="Navegación móvil"
    >
      <NavigationLinks
        items={navigationItems}
        listClassName="mobile-nav-list"
      />
    </nav>
  );
}

export default MobileNavigation;
