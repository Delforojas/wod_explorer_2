import { NavLink } from "react-router-dom";
import type { NavigationItem } from "./navigation";

interface NavigationLinksProps {
  items: readonly NavigationItem[];
  listClassName?: string;
  onNavigate?: () => void;
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
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default NavigationLinks;
