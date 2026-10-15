import { Link } from "react-router-dom";

function HomeView() {
  return (
    <section className="home-page">
      <div className="home-card">
        {/* Logotipo */}
        <div className="home-logo">
          <span>WE</span>
        </div>

        {/* Encabezado */}
        <header className="home-header">
          <p className="home-eyebrow">TU ESPACIO DE ENTRENAMIENTO</p>

          <h1>WOD Explorer</h1>

          <p className="home-description">
            Explora entrenamientos de CrossFit, descubre ejercicios y registra
            tus resultados para superar tus marcas personales.
          </p>
        </header>

        {/* Acción principal */}
        <div className="home-form">
          <Link className="home-submit" to="/wods">
            Explorar WODs →
          </Link>
        </div>

        {/* Separador */}
        <div className="home-divider">
          <span>EXPLORA MÁS</span>
        </div>

        {/* Accesos secundarios */}
        <nav className="home-form" aria-label="Accesos principales">
          <Link className="home-link" to="/exercises">
            Catálogo de ejercicios →
          </Link>

          <Link className="home-link" to="/login">
            Iniciar sesión →
          </Link>
        </nav>
      </div>
    </section>
  );
}

export default HomeView;
