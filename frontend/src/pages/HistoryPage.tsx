import { useEffect, useState } from "react";

import { getWodResults } from "../api/wodsResultsApi";

import type { WodResultResponse } from "../types/WodResult";

function HistoryPage() {
  const [results, setResults] = useState<WodResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWodResults()
      .then((data) => {
        setResults(data);
      })
      .catch(() => {
        setError("No se pudo cargar el historial");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  if (loading) {
    return (
      <section className="placeholder-page">
        <h1>Historial</h1>
        <p>Cargando historial...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="placeholder-page">
        <h1>Historial</h1>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="placeholder-page">
      <h1>Historial</h1>

      {results.length === 0 ? (
        <p>Todavía no has registrado ningún resultado.</p>
      ) : (
        results.map((result) => (
          <article key={result.id}>
            <h2>{result.wodName}</h2>

            <p>{result.type}</p>

            <p>{formatDate(result.performedAt)}</p>

            {renderResult(result)}
          </article>
        ))
      )}
    </section>
  );
}

export default HistoryPage;
