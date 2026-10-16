import type { WodResultResponse } from "../../../types/WodResult";

interface WodResultCardProps {
  result: WodResultResponse;
}

function WodResultCard({ result }: WodResultCardProps) {
  // FORMATEAR FECHA

  function formatDate(date: string): string {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  // FORMATEAR TIEMPO

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  // REPRESENTAR RESULTADO SEGÚN MODALIDAD

  function renderResult() {
    // AMRAP

    if (result.type === "AMRAP") {
      return (
        <p className="my-wod-result-value">
          {result.amrapRounds ?? 0} rondas + {result.amrapExtraReps ?? 0} reps
        </p>
      );
    }

    // EMOM

    if (result.type === "EMOM") {
      return (
        <p className="my-wod-result-value">
          {result.completed ? "Completado" : "No completado"}
        </p>
      );
    }

    // FOR TIME

    if (result.type === "FOR_TIME") {
      // ENTRENAMIENTO COMPLETADO

      if (result.completed && result.timeSeconds !== null) {
        return (
          <p className="my-wod-result-value">
            Tiempo: {formatTime(result.timeSeconds)}
          </p>
        );
      }

      // ENTRENAMIENTO NO COMPLETADO

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

  return (
    <article className="wod-card my-wod-result-card">
      {/* NOMBRE DEL WOD */}

      <h2>{result.wodName}</h2>

      {/* MODALIDAD */}

      <div className="wod-card-meta">
        <span>{result.type}</span>
      </div>

      {/* FECHA */}

      <p className="my-wod-result-date">{formatDate(result.performedAt)}</p>

      {/* RESULTADO */}

      <div className="my-wod-result-content">{renderResult()}</div>
    </article>
  );
}

export default WodResultCard;
