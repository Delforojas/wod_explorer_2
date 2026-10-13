import NavigationLinks from "./NavigationLinks";

import { mobilePrimaryNavigation, publicNavigation } from "./navigation";

interface DesktopNavigationProps {
  isAuthenticated: boolean;
}

function DesktopNavigation({ isAuthenticated }: DesktopNavigationProps) {
  const navigationItems = isAuthenticated
    ? mobilePrimaryNavigation
    : publicNavigation;

  return (
    <nav className="desktop-navigation" aria-label="Navegación principal">
      <NavigationLinks items={navigationItems} listClassName="nav-list" />
    </nav>
  );
}

export default DesktopNavigation;
