import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="site-navbar" aria-label="Navegación principal">
      <Link to="/">Inicio</Link>
      {" | "}
      <Link to="/exercises">Ejercicios</Link>
      {" | "}
      <Link to="/wods">WODs</Link>
    </nav>
  );
}

export default Navbar;
