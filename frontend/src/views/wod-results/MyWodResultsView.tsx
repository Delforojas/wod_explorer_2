import { Link } from "react-router-dom";

import type { WodResultResponse } from "../../types/WodResult";
import MyWodsNavigation from "../../components/layout/MyWodsNavigation";

interface MyWodResultsViewProps {
  results: WodResultResponse[];
  loading: boolean;
  error: string | null;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function renderResult(result: WodResultResponse) {
  if (result.type === "AMRAP") {
    return (
      <p className="my-wod-result-value">
        {result.amrapRounds ?? 0} rondas + {result.amrapExtraReps ?? 0} reps
      </p>
    );
  }

  if (result.type === "EMOM") {
    return (
      <p className="my-wod-result-value">
        {result.completed ? "Completado" : "No completado"}
      </p>
    );
  }

  if (result.type === "FOR_TIME") {
    if (result.completed && result.timeSeconds !== null) {
      return (
        <p className="my-wod-result-value">
          Tiempo: {formatTime(result.timeSeconds)}
        </p>
      );
    }

    return (
      <div className="my-wod-result-progress">
        <p className="my-wod-result-value">No completado</p>

        {result.progressRounds !== null && (
          <p className="my-wod-result-meta">
            Rondas completadas: {result.progressRounds}
          </p>
        )}

        {result.progressReps !== null && (
          <p className="my-wod-result-meta">
            Progreso: {result.progressReps} reps
          </p>
        )}

        {result.progressDistanceM !== null && (
          <p className="my-wod-result-meta">
            Progreso: {result.progressDistanceM} m
          </p>
        )}

        {result.progressDurationSeconds !== null && (
          <p className="my-wod-result-meta">
            Progreso: {result.progressDurationSeconds} segundos
          </p>
        )}
      </div>
    );
  }

  return null;
}

function MyWodResultsView({ results, loading, error }: MyWodResultsViewProps) {
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
          <>
            {/* CONTADOR */}

            <p className="wod-count">{results.length} resultados registrados</p>

            {/* LISTADO */}

            <div className="wod-grid">
              {results.map((result) => (
                <article
                  className="wod-card my-wod-result-card"
                  key={result.id}
                >
                  <h2>{result.wodName}</h2>

                  {/* MODALIDAD */}

                  <div className="wod-card-meta">
                    <span>{result.type}</span>
                  </div>

                  {/* FECHA */}

                  <p className="my-wod-result-date">
                    {formatDate(result.performedAt)}
                  </p>

                  {/* RESULTADO */}

                  <div className="my-wod-result-content">
                    {renderResult(result)}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MyWodResultsView;
