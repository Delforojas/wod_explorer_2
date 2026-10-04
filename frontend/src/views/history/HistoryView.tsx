import type { WodResultResponse } from "../../types/WodResult";
import type { HistoryViewProps } from "./HistoryView.Types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function renderResult(result: WodResultResponse) {
  if (result.type === "AMRAP") {
    return (
      <p>
        {result.amrapRounds ?? 0} rondas + {result.amrapExtraReps ?? 0} reps
      </p>
    );
  }

  if (result.type === "EMOM") {
    return <p>{result.completed ? "Completado" : "No completado"}</p>;
  }

  if (result.type === "FOR_TIME") {
    if (result.completed && result.timeSeconds !== null) {
      return <p>Tiempo: {formatTime(result.timeSeconds)}</p>;
    }

    return (
      <div>
        <p>No completado</p>

        {result.progressRounds !== null && (
          <p>Rondas completadas: {result.progressRounds}</p>
        )}

        {result.progressReps !== null && (
          <p>Progreso: {result.progressReps} reps</p>
        )}

        {result.progressDistanceM !== null && (
          <p>Progreso: {result.progressDistanceM} m</p>
        )}

        {result.progressDurationSeconds !== null && (
          <p>Progreso: {result.progressDurationSeconds} segundos</p>
        )}
      </div>
    );
  }

  return null;
}

function HistoryView({ results, loading, error }: HistoryViewProps) {
  if (loading) {
    return (
      <section className="page placeholder-page">
        <h1>Historial</h1>
        <p className="ui-loading">Cargando historial...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page placeholder-page">
        <h1>Historial</h1>
        <p className="ui-error" role="alert">{error}</p>
      </section>
    );
  }

  return (
    <section className="page placeholder-page">
      <header className="page-header"><p className="page-eyebrow">Registro personal</p><h1>Historial</h1></header>

      {results.length === 0 ? (
        <p className="ui-empty">Todavía no has registrado ningún resultado.</p>
      ) : (
        <div className="resource-list">{results.map((result) => (
          <article className="resource-row" key={result.id}>
            <header><h2>{result.wodName}</h2><span className="badge">{result.type}</span></header>
            <p className="resource-meta">{formatDate(result.performedAt)}</p>
            {renderResult(result)}
          </article>
        ))}</div>
      )}
    </section>
  );
}

export default HistoryView;
