import { Link } from "react-router-dom";

import {
  formatWodResultDate,
  formatWodType,
  getWodResultLines,
} from "../wod-results/resultPresentation";
import type { HomeViewProps } from "./HomeView.Types";
import {
  formatWodCategory,
  formatWodPrescription,
  getHomeDisplayName,
} from "./homePresentation";

function HomeView({
  isAuthenticated,
  username,
  activityStatus,
  activityResults,
  activityError,
  onRetry,
  featuredStatus,
  featuredWods,
  featuredError,
  onRetryFeatured,
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

              <div className="home-dashboard-hero-copy">
                <p className="home-eyebrow">TU ENTRENAMIENTO</p>
                <h1>Hola, {getHomeDisplayName(username)}</h1>
                <p className="home-description">
                  Continúa donde lo dejaste y registra cada sesión para ver tu
                  progreso.
                </p>
              </div>

              <div className="home-dashboard-hero-actions">
                <Link
                  className="home-dashboard-primary"
                  to="/my-wod-results/new"
                >
                  Registrar resultado de WOD <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className="home-dashboard-secondary"
                  to="/exercise-results/new"
                >
                  Registrar resultado de ejercicio
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
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

              <Link
                className="home-dashboard-action"
                to="/my-exercise-results"
              >
                <span>
                  <strong>Benchmarks</strong>
                  <small>Consulta tus marcas de ejercicios</small>
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
                      <p className="home-activity-meta">
                        <span className="home-activity-kind">WOD</span>
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
    <section className="home-page home-guest-page">
      <div className="home-guest">
        <header className="home-guest-hero">
          <div className="home-guest-hero-copy">
            <p className="home-eyebrow">WOD EXPLORER 2.0</p>
            <h1>
              Cada WOD <span>cuenta.</span>
            </h1>
            <p>
              Encuentra sesiones de crosstraining e hybrid, entiende su
              estructura y elige tu siguiente reto.
            </p>
            <div className="home-guest-actions">
              <Link className="home-guest-primary" to="/wods">
                Explorar WODs <span aria-hidden="true">→</span>
              </Link>
              <Link className="home-guest-secondary" to="/register">
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="home-guest-mark" aria-hidden="true">
            <span>WE</span>
            <small>ENTRENA / REGISTRA / SUPÉRATE</small>
          </div>
        </header>

        <section className="home-discovery" aria-labelledby="home-discovery-title">
          <div className="home-section-heading">
            <p className="home-eyebrow">DESCUBRE EL CATÁLOGO</p>
            <h2 id="home-discovery-title">Elige tu forma de entrenar</h2>
          </div>

          <div className="home-category-grid">
            <Link
              className="home-category-card home-category-card--cross"
              to="/wods?category=CROSSTRAINING"
            >
              <span className="home-category-card-index" aria-hidden="true">01</span>
              <div>
                <p>CROSSTRAINING</p>
                <h3>Fuerza, técnica e intensidad</h3>
                <span>Explorar sesiones <b aria-hidden="true">→</b></span>
              </div>
            </Link>

            <Link
              className="home-category-card home-category-card--hybrid"
              to="/wods?category=HYBRID"
            >
              <span className="home-category-card-index" aria-hidden="true">02</span>
              <div>
                <p>HYBRID</p>
                <h3>Carrera, resistencia y estaciones funcionales</h3>
                <span>Explorar sesiones <b aria-hidden="true">→</b></span>
              </div>
            </Link>
          </div>
        </section>

        <section className="home-featured" aria-labelledby="home-featured-title">
          <header className="home-featured-header">
            <div>
              <p className="home-eyebrow">SELECCIÓN DEL CATÁLOGO</p>
              <h2 id="home-featured-title">Descubre tu próximo reto</h2>
            </div>
            <Link to="/wods">Ver todos <span aria-hidden="true">→</span></Link>
          </header>

          {featuredStatus === "loading" ? (
            <div className="home-featured-grid" role="status" aria-live="polite">
              <p className="home-featured-loading">Cargando WODs destacados...</p>
              {[0, 1, 2].map((index) => (
                <div className="home-featured-skeleton" key={index} aria-hidden="true" />
              ))}
            </div>
          ) : featuredStatus === "error" ? (
            <div className="home-featured-state" role="alert">
              <p>{featuredError ?? "No se pudieron cargar los WODs destacados."}</p>
              <button type="button" onClick={onRetryFeatured}>Reintentar</button>
            </div>
          ) : featuredWods.length === 0 ? (
            <div className="home-featured-state" role="status">
              <p>Aún no hay WODs públicos disponibles en el catálogo.</p>
              <Link to="/wods">Explorar el catálogo</Link>
            </div>
          ) : (
            <div className="home-featured-grid">
              {featuredWods.map((wod, index) => (
                <Link className="home-featured-card" to={`/wods?wodId=${wod.id}`} key={wod.id}>
                  <span className="home-featured-number" aria-hidden="true">0{index + 1}</span>
                  <div>
                    <p>{formatWodCategory(wod.category)}</p>
                    <h3>{wod.name}</h3>
                    <span>{wod.version.type === "FOR_TIME" ? "For Time" : wod.version.type} · {formatWodPrescription(wod)}</span>
                  </div>
                  <span className="home-featured-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="home-value-grid" aria-label="Explora y registra tu entrenamiento">
          <div className="home-value-panel">
            <p className="home-eyebrow">TU PROGRESO EMPIEZA AQUÍ</p>
            <h2>Registra resultados, consulta tu historial y sigue tus mejores marcas.</h2>
            <Link to="/register">Crear cuenta <span aria-hidden="true">→</span></Link>
          </div>
          <Link className="home-exercises-panel" to="/exercises">
            <p>CATÁLOGO DE EJERCICIOS</p>
            <h2>Explora los movimientos que construyen cada WOD.</h2>
            <span>Ver ejercicios <b aria-hidden="true">→</b></span>
          </Link>
        </section>
      </div>
    </section>
  );
}

export default HomeView;
