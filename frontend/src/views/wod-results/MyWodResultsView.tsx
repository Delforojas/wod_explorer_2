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
      <p className="result-value">
        {result.amrapRounds ?? 0} rondas + {result.amrapExtraReps ?? 0} reps
      </p>
    );
  }

  if (result.type === "EMOM") {
    return (
      <p className="result-value">
        {result.completed ? "Completado" : "No completado"}
      </p>
    );
  }

  if (result.type === "FOR_TIME") {
    if (result.completed && result.timeSeconds !== null) {
      return (
        <p className="result-value">Tiempo: {formatTime(result.timeSeconds)}</p>
      );
    }

    return (
      <div className="result-progress">
        <p className="result-value">No completado</p>

        {result.progressRounds !== null && (
          <p className="resource-meta">
            Rondas completadas: {result.progressRounds}
          </p>
        )}

        {result.progressReps !== null && (
          <p className="resource-meta">Progreso: {result.progressReps} reps</p>
        )}

        {result.progressDistanceM !== null && (
          <p className="resource-meta">
            Progreso: {result.progressDistanceM} m
          </p>
        )}

        {result.progressDurationSeconds !== null && (
          <p className="resource-meta">
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
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Mis entrenamientos</p>

        <h1>Mis WODs</h1>

        <p>
          Consulta tus resultados y sigue tu progreso en cada entrenamiento.
        </p>
      </header>

      {/* Navegación secundaria */}

      <MyWodsNavigation />

      {/* Registrar resultado */}

      <nav className="marks-navigation" aria-label="Acciones de resultados">
        <Link
          to="/my-wod-results/new"
          className="marks-nav-link marks-nav-action"
        >
          + Registrar resultado
        </Link>
      </nav>

      {/* Listado de resultados */}

      {loading ? (
        <p className="ui-loading">Cargando resultados de WODs...</p>
      ) : error ? (
        <p className="ui-error" role="alert">
          {error}
        </p>
      ) : results.length === 0 ? (
        <p className="ui-empty">
          Todavía no has registrado ningún resultado de WOD.
        </p>
      ) : (
        <div className="resource-list glass-panel">
          {results.map((result) => (
            <article
              className="resource-row resource-row-static"
              key={result.id}
            >
              <header>
                <h2>{result.wodName}</h2>

                <span className="resource-meta">{result.type}</span>
              </header>

              <p className="resource-meta">{formatDate(result.performedAt)}</p>

              {renderResult(result)}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyWodResultsView;
