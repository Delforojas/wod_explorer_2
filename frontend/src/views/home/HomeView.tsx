import { Link } from "react-router-dom";

function HomeView() {
  return (
    <section className="page home-page">
      <header className="home-intro">
        <p className="page-eyebrow">Registro de entrenamiento</p>
        <h1>WOD Explorer</h1>
        <p>Explora WODs, ejercicios y registra tus resultados.</p>
      </header>

      <div className="home-primary-action">
        <Link className="button-primary home-primary-link" to="/wods">
          Explorar WODs
        </Link>
      </div>

      <nav className="home-routes" aria-label="Accesos principales">
        <Link to="/exercises">
          <span>Catálogo de ejercicios</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/login">
          <span>Iniciar sesión para registrar resultados</span>
          <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </section>
  );
}

export default HomeView;
