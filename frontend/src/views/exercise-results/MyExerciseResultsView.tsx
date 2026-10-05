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

  function renderResult(result: ExerciseResultResponse) {
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
      return <p className="result-value">{result.durationSeconds} segundos</p>;
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

  if (loading) {
    return <p className="ui-loading">Cargando tus marcas...</p>;
  }

  if (error) {
    return <p className="ui-error" role="alert">{error}</p>;
  }

  return (
    <section className="page">
      <header className="page-header"><p className="page-eyebrow">Registro personal</p><h1>Mis marcas</h1><p>Aquí puedes consultar tus resultados de ejercicios.</p></header>

      {results.length === 0 ? (
        <p className="ui-empty">Todavía no has registrado ninguna marca.</p>
      ) : (
        <div className="resource-list glass-panel">{results.map((result) => (
          <article className="resource-row resource-row-static" key={result.id}>
            <header><h2>{getExerciseName(result.exerciseId)}</h2></header>

            {renderResult(result)}

            <p className="resource-meta">{formatDate(result.performedAt)}</p>
          </article>
        ))}</div>
      )}
    </section>
  );
}

export default MyExerciseResultsView;
