import { useEffect, useState } from "react";
import { getExerciseResults } from "../api/exerciseResultsApi";
import { getExercises } from "../api/exercisesApi";
import type { ExerciseResultResponse } from "../types/ExerciseResult";
import type { ExerciseResponse } from "../types/Exercise";

function MyExerciseResultsPage() {
  const [results, setResults] = useState<ExerciseResultResponse[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getExerciseResults(), getExercises()])
      .then(([resultsData, exercisesData]) => {
        setResults(resultsData);
        setExercises(exercisesData);
      })
      .catch(() => {
        setError("No se pudieron cargar tus marcas");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function getExerciseName(exerciseId: number): string {
    const exercise = exercises.find((exercise) => exercise.id === exerciseId);

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
        <p>
          {result.weightKg} kg × {result.reps} reps
        </p>
      );
    }

    if (result.reps !== null) {
      return <p>{result.reps} reps</p>;
    }

    if (result.durationSeconds !== null) {
      return <p>{result.durationSeconds} segundos</p>;
    }

    if (result.distanceM !== null && result.weightKg !== null) {
      return (
        <p>
          {result.weightKg} kg · {result.distanceM} m
        </p>
      );
    }

    if (result.distanceM !== null) {
      return <p>{result.distanceM} m</p>;
    }

    return <p>Resultado sin datos</p>;
  }

  if (loading) {
    return <p>Cargando tus marcas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Mis marcas</h1>

      <p>Aquí puedes consultar tus resultados de ejercicios.</p>

      {results.length === 0 ? (
        <p>Todavía no has registrado ninguna marca.</p>
      ) : (
        results.map((result) => (
          <article key={result.id}>
            <h2>{getExerciseName(result.exerciseId)}</h2>

            {renderResult(result)}

            <p>{formatDate(result.performedAt)}</p>
          </article>
        ))
      )}
    </section>
  );
}

export default MyExerciseResultsPage;
