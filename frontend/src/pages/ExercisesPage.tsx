import { useEffect, useState } from "react";
import type { ExerciseResponse } from "../types/Exercise";
import { getExercises, getExerciseById } from "../api/exercisesApi";

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
        <div key={exercise.id}>
          <strong>{exercise.name}</strong>
          <span> {exercise.category}</span>
          <span> {exercise.measurementType}</span>

          <button onClick={() => handleSelectExercise(exercise.id)}>
            Ver detalle
          </button>
        </div>
      ))}

      {selectedExercise && (
        <div>
          <h3>Detalle del ejercicio</h3>

          <p>ID: {selectedExercise.id}</p>
          <p>Nombre: {selectedExercise.name}</p>
          <p>Categoría: {selectedExercise.category}</p>
          <p>Medición: {selectedExercise.measurementType}</p>
          <p>Activo: {selectedExercise.active ? "Sí" : "No"}</p>
        </div>
      )}
    </section>
  );
}

export default ExercisesPage;
