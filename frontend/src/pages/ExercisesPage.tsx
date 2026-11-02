import { useEffect, useState } from "react";
import type { ExerciseResponse } from "../types/Exercise";
import { getExercises } from "../api/exercisesApi";
import ExercisesView from "../views/exercises/ExercisesView";

function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getExercises()
      .then((data) => {
        if (active) {
          setExercises(data);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar los ejercicios");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ExercisesView
      exercises={exercises}
      loading={loading}
      error={error}
    />
  );
}

export default ExercisesPage;
