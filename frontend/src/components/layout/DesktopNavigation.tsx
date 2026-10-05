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
      <NavigationLinks items={publicNavigation} withTextRoll />
      {isAuthenticated && (
        <div className="nav-group">
          <span className="nav-section-label">Mi actividad</span>
          <NavigationLinks items={personalNavigation} withTextRoll />
        </div>
      )}
    </nav>
  );
}

export default DesktopNavigation;
