import { NavLink } from "react-router-dom";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import type { MyExerciseResultsViewProps } from "./MyExerciseResultsView.Types";

function MyExerciseResultsView({
  results,
  exercises,
  loading,
  error,
}: MyExerciseResultsViewProps) {
  function getExerciseName(exerciseId: number): string {
    const exercise = exercises.find((item) => item.id === exerciseId);

    return exercise?.name ?? `Ejercicio #${exerciseId}`;
  }

  function formatDate(date: string): string {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function formatDuration(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function renderResult(result: ExerciseResultResponse) {
    if (result.distanceM !== null && result.durationSeconds !== null) {
      return (
        <p className="result-value">
          {result.distanceM} m · {formatDuration(result.durationSeconds)}
        </p>
      );
    }

    if (result.weightKg !== null && result.reps !== null) {
      return (
        <p className="result-value">
          {result.weightKg} kg × {result.reps} reps
        </p>
      );
    }

    if (result.reps !== null) {
      return <p className="result-value">{result.reps} reps</p>;
    }

    if (result.durationSeconds !== null) {
      return (
        <p className="result-value">{formatDuration(result.durationSeconds)}</p>
      );
    }

    if (result.distanceM !== null && result.weightKg !== null) {
      return (
        <p className="result-value">
          {result.weightKg} kg · {result.distanceM} m
        </p>
      );
    }

    if (result.distanceM !== null) {
      return <p className="result-value">{result.distanceM} m</p>;
    }

    return <p className="result-value">Resultado sin datos</p>;
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Seguimiento personal</p>
        <h1>Marcas</h1>
        <p>
          Registra tus resultados, consulta tus marcas y sigue tus progresos.
        </p>
      </header>

      {/* Navegación secundaria */}

      <nav className="marks-navigation" aria-label="Secciones de marcas">
        <NavLink
          to="/personal-bests"
          className={({ isActive }) =>
            isActive ? "marks-nav-link marks-nav-link-active" : "marks-nav-link"
          }
        >
          Mejores marcas
        </NavLink>

        <NavLink
          to="/exercise-results/new"
          className="marks-nav-link marks-nav-action"
        >
          + Registrar marca
        </NavLink>
      </nav>

      {/* Contenido */}

      {loading ? (
        <p className="ui-loading">Cargando tus marcas...</p>
      ) : error ? (
        <p className="ui-error" role="alert">
          {error}
        </p>
      ) : results.length === 0 ? (
        <p className="ui-empty">Todavía no has registrado ninguna marca.</p>
      ) : (
        <div className="resource-list glass-panel">
          {results.map((result) => (
            <article
              className="resource-row resource-row-static"
              key={result.id}
            >
              <header>
                <h2>{getExerciseName(result.exerciseId)}</h2>
              </header>

              {renderResult(result)}

              <p className="resource-meta">{formatDate(result.performedAt)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyExerciseResultsView;
