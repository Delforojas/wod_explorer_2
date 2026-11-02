import { useEffect, useRef, useState } from "react";
import type { ExerciseResponse } from "../types/Exercise";
import { getExercises, getExerciseById } from "../api/exercisesApi";
import { isLatestRequest } from "../utils/asyncRequest";
import ExercisesView from "../views/exercises/ExercisesView";

function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectionRequest = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    let active = true;
    mounted.current = true;

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
      mounted.current = false;
    };
  }, []);

  async function handleSelectExercise(id: number) {
    const requestId = ++selectionRequest.current;

    try {
      setError(null);

      const exercise = await getExerciseById(id);

      if (!mounted.current || !isLatestRequest(requestId, selectionRequest.current)) {
        return;
      }

      setSelectedExercise(exercise);
    } catch {
      if (mounted.current && isLatestRequest(requestId, selectionRequest.current)) {
        setError("No se pudo cargar el ejercicio");
      }
    }
  }

  return (
    <ExercisesView
      exercises={exercises}
      selectedExercise={selectedExercise}
      loading={loading}
      error={error}
      onSelectExercise={handleSelectExercise}
    />
  );
}

export default ExercisesPage;
