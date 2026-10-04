import type { ExercisesViewProps } from "./ExercisesView.Types";

function ExercisesView({
  exercises,
  selectedExercise,
  loading,
  error,
  onSelectExercise,
}: ExercisesViewProps) {
  if (loading) {
    return <p>Cargando ejercicios...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <h2>Ejercicios</h2>

      {exercises.map((exercise) => (
        <div key={exercise.id}>
          <strong>{exercise.name}</strong>
          <span> {exercise.category}</span>
          <span> {exercise.measurementType}</span>

          <button onClick={() => onSelectExercise(exercise.id)}>
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

export default ExercisesView;
