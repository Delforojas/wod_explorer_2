interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  return (
    <button
      type="button"
      className="sidebar-toggle"
      onClick={onToggle}
      aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      aria-expanded={!collapsed}
      title={collapsed ? "Expandir navegación" : "Colapsar navegación"}
    >
      <svg
        className="sidebar-toggle-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {collapsed ? (
          <>
            <path d="M9 18l6-6-6-6" />
          </>
        ) : (
          <>
            <path d="M15 18l-6-6 6-6" />
          </>
        )}
      </svg>
    </button>
  );
}

export default SidebarToggle;