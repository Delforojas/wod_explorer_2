import { Link } from "react-router-dom";

import {
  formatWodResultDate,
  formatWodType,
  getWodResultLines,
} from "../wod-results/resultPresentation";
import type { HomeViewProps } from "./HomeView.Types";
import { getHomeDisplayName } from "./homePresentation";

function HomeView({
  isAuthenticated,
  username,
  activityStatus,
  activityResults,
  activityError,
  onRetry,
}: HomeViewProps) {
  if (isAuthenticated) {
    return (
      <section className="home-page home-dashboard-page">
        <div className="home-dashboard">
          <div className="home-dashboard-top">
            <header className="home-dashboard-hero">
              <div className="home-logo" aria-hidden="true">
                <span>WE</span>
              </div>

              <div>
                <p className="home-eyebrow">TU ENTRENAMIENTO</p>
                <h1>Hola, {getHomeDisplayName(username)}</h1>
                <p className="home-description">
                  Continúa donde lo dejaste y registra cada sesión para ver tu
                  progreso.
                </p>
              </div>

              <Link className="home-dashboard-primary" to="/my-wod-results/new">
                Registrar resultado de WOD <span aria-hidden="true">→</span>
              </Link>
            </header>

            <nav
              className="home-dashboard-actions"
              aria-label="Acciones de entrenamiento"
            >
              <p className="home-dashboard-label">ACCESOS RÁPIDOS</p>

              <Link className="home-dashboard-action" to="/my-wods">
                <span>
                  <strong>Mis WODs</strong>
                  <small>Revisa tus entrenamientos personales</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>

              <Link className="home-dashboard-action" to="/create-wod">
                <span>
                  <strong>Crear WOD personal</strong>
                  <small>Diseña una sesión a tu medida</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>

              <Link className="home-dashboard-action" to="/wods">
                <span>
                  <strong>Explorar WODs</strong>
                  <small>Encuentra tu próximo entrenamiento</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </div>

          <section
            className="home-activity"
            aria-labelledby="home-activity-title"
          >
            <header className="home-activity-header">
              <div>
                <p className="home-dashboard-label">TU REGISTRO</p>
                <h2 id="home-activity-title">Actividad reciente</h2>
              </div>

              <Link className="home-activity-link" to="/history">
                Ver historial <span aria-hidden="true">→</span>
              </Link>
            </header>

            {activityStatus === "loading" ? (
              <p className="home-activity-state" role="status" aria-live="polite">
                Cargando tu actividad...
              </p>
            ) : activityStatus === "error" ? (
              <div className="home-activity-state" role="alert">
                <p>{activityError ?? "No se pudo cargar tu actividad."}</p>
                <button className="home-retry" type="button" onClick={onRetry}>
                  Reintentar
                </button>
              </div>
            ) : activityResults.length === 0 ? (
              <div className="home-activity-state">
                <p className="home-activity-empty-title">
                  No hay resultados aún
                </p>
                <p>Registra tu primer WOD para empezar a seguir tu progreso.</p>
                <div className="home-activity-empty-actions">
                  <Link className="home-activity-link" to="/my-wod-results/new">
                    Registrar primer WOD
                  </Link>
                  <Link className="home-activity-link" to="/wods">
                    Explorar WODs
                  </Link>
                </div>
              </div>
            ) : (
              <ol className="home-activity-list">
                {activityResults.map((result) => (
                  <li className="home-activity-item" key={result.id}>
                    <div>
                      <h3>{result.wodName}</h3>
                      <p>
                        {formatWodType(result.type)} ·{" "}
                        {formatWodResultDate(result.performedAt)}
                      </p>
                    </div>
                    <div className="home-activity-result">
                      <strong>{getWodResultLines(result)[0]}</strong>
                      <span>
                        {result.completed ? "Completado" : "En progreso"}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </section>
    );
  }

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
