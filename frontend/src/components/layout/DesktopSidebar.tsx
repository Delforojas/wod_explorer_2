import type { ReactNode } from "react";
import DesktopNavigation from "./DesktopNavigation";

interface DesktopSidebarProps {
  collapsed: boolean;
  isAuthenticated: boolean;
  children?: ReactNode;
}

function DesktopSidebar({ collapsed, isAuthenticated, children }: DesktopSidebarProps) {
  return (
    <aside
      className={`desktop-sidebar ${collapsed ? "collapsed" : "expanded"}`}
      aria-label="Navegación principal"
      data-collapsed={collapsed}
    >
      <div className="sidebar-content">
        <div className="sidebar-header">
          <span className="sidebar-brand">WOD EXPLORER</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          <DesktopNavigation isAuthenticated={isAuthenticated} collapsed={collapsed} />
        </nav>

        {children && <div className="sidebar-footer">{children}</div>}
      </div>
    </aside>
  );
}

export default DesktopSidebar;