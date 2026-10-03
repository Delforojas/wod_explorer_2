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

  return (
    <MyExerciseResultsView
      results={results}
      exercises={exercises}
      loading={loading}
      error={error}
    />
  );
}

export default MyExerciseResultsPage;
