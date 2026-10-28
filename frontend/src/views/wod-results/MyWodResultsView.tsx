import { Link } from "react-router-dom";

import MyWodsNavigation from "../../components/layout/MyWodsNavigation";

import type { MyWodResultsViewProps } from "./MyWodResultsView.Types";

import WodResultsList from "./components/WodResultsList";

function MyWodResultsView({
  results,
  loading,
  error,
  deletingId,
  onDelete,
}: MyWodResultsViewProps) {
  return (
    <section className="wod-page my-wod-results-page">
      <div className="wod-container">
        {/* ENCABEZADO */}

        <header className="wod-header">
          <p className="wod-eyebrow">MIS ENTRENAMIENTOS</p>

          <h1>Mis WODs</h1>

          <p className="wod-description">
            Consulta tus resultados y sigue tu progreso en cada entrenamiento.
          </p>
        </header>

        {/* NAVEGACIÓN SECUNDARIA */}

        <div className="my-wod-results-navigation">
          <MyWodsNavigation />
        </div>

        {/* REGISTRAR RESULTADO */}

        <nav
          className="my-wod-results-actions"
          aria-label="Acciones de resultados"
        >
          <Link to="/my-wod-results/new" className="my-wods-nav-link">
            + Registrar resultado
          </Link>
        </nav>

        {/* ESTADOS */}

        {loading ? (
          <p className="wod-empty" role="status">
            Cargando resultados de WODs...
          </p>
        ) : error ? (
          <p className="wod-error" role="alert">
            {error}
          </p>
        ) : results.length === 0 ? (
          <p className="wod-empty">
            Todavía no has registrado ningún resultado de WOD.
          </p>
        ) : (
          <WodResultsList
            results={results}
            deletingId={deletingId}
            onDelete={onDelete}
          />
        )}
      </div>
    </section>
  );
}

export default MyWodResultsView;
