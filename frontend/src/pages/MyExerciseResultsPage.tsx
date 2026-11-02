import { useEffect, useState } from "react";
import { getExerciseResults } from "../api/exerciseResultsApi";
import { getExercises } from "../api/exercisesApi";
import type { ExerciseResultResponse } from "../types/ExerciseResult";
import type { ExerciseResponse } from "../types/Exercise";
import MyExerciseResultsView from "../views/exercise-results/MyExerciseResultsView";

function MyExerciseResultsPage() {
  const [results, setResults] = useState<ExerciseResultResponse[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getExerciseResults(), getExercises()])
      .then(([resultsData, exercisesData]) => {
        if (cancelled) {
          return;
        }

        setResults(resultsData);
        setExercises(exercisesData);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setError("No se pudieron cargar tus marcas");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <MyExerciseResultsView
      results={results}
      exercises={exercises}
      loading={loading}
      error={error}
      onRetry={() => {
        setError(null);
        setLoading(true);
        setReloadKey((current) => current + 1);
      }}
    />
  );
}

export default MyExerciseResultsPage;
