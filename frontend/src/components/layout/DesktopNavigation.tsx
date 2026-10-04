import NavigationLinks from "./NavigationLinks";
import { personalNavigation, publicNavigation } from "./navigation";

interface DesktopNavigationProps {
  isAuthenticated: boolean;
}

function DesktopNavigation({
  isAuthenticated,
}: DesktopNavigationProps) {
  return (
    <nav className="desktop-navigation" aria-label="Navegación principal">
      <NavigationLinks items={publicNavigation} />
      {isAuthenticated && (
        <div className="nav-group">
          <span className="nav-section-label">Mi actividad</span>
          <NavigationLinks items={personalNavigation} />
        </div>
      )}
    </nav>
  );
}

export default DesktopNavigation;
