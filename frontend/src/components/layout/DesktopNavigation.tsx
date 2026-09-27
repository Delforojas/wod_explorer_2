import NavigationLinks from "./NavigationLinks";
import { personalNavigation, publicNavigation } from "./navigation";

interface DesktopNavigationProps {
  isAuthenticated: boolean;
}

function DesktopNavigation({
  isAuthenticated,
}: DesktopNavigationProps) {
  return (
    <div className="desktop-navigation">
      <NavigationLinks items={publicNavigation} />
      {isAuthenticated && (
        <div className="nav-group">
          <span className="nav-section-label">Mi actividad</span>
          <NavigationLinks items={personalNavigation} />
        </div>
      )}
    </div>
  );
}

export default DesktopNavigation;
