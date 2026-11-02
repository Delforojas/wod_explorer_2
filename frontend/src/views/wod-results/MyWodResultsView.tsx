import { Link } from "react-router-dom";

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

        <header className="wod-header exercise-results-header">
          <p className="wod-eyebrow">SEGUIMIENTO PERSONAL</p>

          <h1>WOD Results</h1>

          <p className="wod-description">
            Consulta tus resultados y sigue tu evolución en cada entrenamiento.
          </p>
        </header>

        {/* REGISTRAR RESULTADO */}

        <nav
          className="exercise-results-navigation my-wod-results-navigation"
          aria-label="Acciones de resultados"
        >
          <Link
            to="/my-wod-results/new"
            className="exercise-results-nav-link exercise-results-nav-action"
          >
            + Add Score
          </Link>
        </nav>

        {/* ESTADOS */}

        {loading ? (
          <p className="exercise-results-loading" role="status">
            Cargando resultados de WODs...
          </p>
        ) : error ? (
          <p className="exercise-results-error" role="alert">
            {error}
          </p>
        ) : results.length === 0 ? (
          <p className="exercise-results-empty" role="status" aria-live="polite">
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
