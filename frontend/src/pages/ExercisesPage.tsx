import { useEffect, useState } from "react";
import { getExercises } from "../api/exercisesApi";
import type { Exercise } from "../types/Exercise";

function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
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

  if (loading) {
    return <p>Cargando ejercicios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Ejercicios</h2>

      {exercises.map((exercise) => (
        <p key={exercise.id}>{exercise.name}</p>
      ))}
    </section>
  );
}

export default ExercisesPage;
