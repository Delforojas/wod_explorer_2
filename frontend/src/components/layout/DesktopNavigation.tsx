import NavigationLinks from "./NavigationLinks";
import { personalNavigation, publicNavigation } from "./navigation";

interface DesktopNavigationProps {
  isAuthenticated: boolean;
  collapsed?: boolean;
}

function DesktopNavigation({ isAuthenticated, collapsed = false }: DesktopNavigationProps) {
  return (
    <nav className="desktop-navigation" aria-label="Navegación principal">
      <NavigationLinks items={publicNavigation} collapsed={collapsed} withTextRoll />
      {isAuthenticated && (
        <div className="nav-group">
          <span className="nav-section-label">Mi actividad</span>
          <NavigationLinks items={personalNavigation} collapsed={collapsed} withTextRoll />
        </div>
      )}
    </nav>
  );
}

export default DesktopNavigation;