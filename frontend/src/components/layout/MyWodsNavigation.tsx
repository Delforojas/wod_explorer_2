import { NavLink } from "react-router-dom";

function MyWodsNavigation() {
  return (
    <nav className="marks-navigation" aria-label="Secciones de mis WODs">
      <NavLink to="/my-wod-results" className="marks-nav-link">
        Resultados
      </NavLink>
    </nav>
  );
}

export default MyWodsNavigation;
