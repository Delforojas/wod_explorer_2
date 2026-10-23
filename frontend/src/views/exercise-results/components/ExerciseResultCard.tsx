import type { ExerciseResultResponse } from "../../../types/ExerciseResult";

interface ExerciseResultCardProps {
  result: ExerciseResultResponse;
  exerciseName: string;
}

function ExerciseResultCard({ result, exerciseName }: ExerciseResultCardProps) {
  // FORMATO DE FECHA

  function formatDate(date: string): string {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  // FORMATO DE DURACIÓN

  function formatDuration(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // REPRESENTACIÓN DEL RESULTADO

  function renderResult() {
    // DISTANCIA + TIEMPO

    if (result.distanceM !== null && result.durationSeconds !== null) {
      return (
        <p className="result-value">
          {result.distanceM} m · {formatDuration(result.durationSeconds)}
        </p>
      );
    }

    // PESO + REPETICIONES

    if (result.weightKg !== null && result.reps !== null) {
      return (
        <p className="result-value">
          {result.weightKg} kg × {result.reps} reps
        </p>
      );
    }

    // REPETICIONES

    if (result.reps !== null) {
      return <p className="result-value">{result.reps} reps</p>;
    }

    // TIEMPO

    if (result.durationSeconds !== null) {
      return (
        <p className="result-value">{formatDuration(result.durationSeconds)}</p>
      );
    }

    // PESO + DISTANCIA

    if (result.distanceM !== null && result.weightKg !== null) {
      return (
        <p className="result-value">
          {result.weightKg} kg · {result.distanceM} m
        </p>
      );
    }

    // DISTANCIA

    if (result.distanceM !== null) {
      return <p className="result-value">{result.distanceM} m</p>;
    }

    // SIN DATOS

    return <p className="result-value">Resultado sin datos</p>;
  }

  return (
    <article className="resource-row resource-row-static">
      {/* NOMBRE DEL EJERCICIO */}

      <header>
        <h2>{exerciseName}</h2>
      </header>

      {/* RESULTADO */}

      {renderResult()}

      {/* FECHA */}

      <p className="resource-meta">{formatDate(result.performedAt)}</p>
    </article>
  );
}

export default ExerciseResultCard;
