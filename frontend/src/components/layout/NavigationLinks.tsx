import { NavLink } from "react-router-dom";
import type { NavigationIconName, NavigationItem } from "./navigation";

interface NavigationLinksProps {
  items: readonly NavigationItem[];
  listClassName?: string;
  onNavigate?: () => void;
}

function NavigationIcon({ icon }: { icon: NavigationIconName }) {
  const paths: Record<NavigationIconName, string> = {
    activity: "M3 12h3l2-6 4 12 2-6h7",
    barbell: "M4 9v6m3-8v10m3-5h4m3-5v10m3-8v6",
    clock: "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    document: "M7 3h7l4 4v14H7V3Zm7 0v5h5",
    plus: "M12 5v14m-7-7h14",
    trophy: "M8 4h8v5a4 4 0 0 1-8 0V4Zm-3 2H3v2a4 4 0 0 0 4 4m10-6h2v2a4 4 0 0 1-4 4m-6 4v3m-3 2h12",
  };

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[icon]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavigationLinks({
  items,
  listClassName = "nav-list",
  onNavigate,
}: NavigationLinksProps) {
  return (
    <ul className={listClassName}>
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            <NavigationIcon icon={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default NavigationLinks;
