import AuthActions from "./AuthActions";
import NavigationLinks from "./NavigationLinks";
import { personalNavigation, publicNavigation } from "./navigation";

interface MobileNavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onNavigate: () => void;
}

function MobileNavigation({
  isAuthenticated,
  onLogout,
  onNavigate,
}: MobileNavigationProps) {
  return (
    <div id="mobile-navigation" className="mobile-navigation">
      <NavigationLinks
        items={publicNavigation}
        listClassName="mobile-nav-list"
        onNavigate={onNavigate}
      />
      {isAuthenticated && (
        <div className="mobile-nav-group">
          <h2 className="nav-section-label">Mi actividad</h2>
          <NavigationLinks
            items={personalNavigation}
            listClassName="mobile-nav-list"
            onNavigate={onNavigate}
          />
        </div>
      )}
      <AuthActions
        className="mobile-auth-actions"
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default MobileNavigation;
