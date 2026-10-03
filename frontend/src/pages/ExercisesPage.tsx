import { useEffect, useState } from "react";
import type { ExerciseResponse } from "../types/Exercise";
import { getExercises, getExerciseById } from "../api/exercisesApi";
import ExercisesView from "../views/exercises/ExercisesView";

function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExercises()
      .then((data) => {
        setExercises(data);
      })
      .catch(() => {
        setError("No se pudieron cargar los ejercicios");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSelectExercise(id: number) {
    try {
      setError(null);

      const exercise = await getExerciseById(id);

      setSelectedExercise(exercise);
    } catch {
      setError("No se pudo cargar el ejercicio");
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
