import type { ExercisesViewProps } from "./ExercisesView.Types";

function ExercisesView({
  exercises,
  selectedExercise,
  loading,
  error,
  onSelectExercise,
}: ExercisesViewProps) {
  if (loading) {
    return <p className="ui-loading">Cargando ejercicios...</p>;
  }

  if (error) {
    return <p className="ui-error" role="alert">{error}</p>;
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Catálogo</p>
        <h1>Ejercicios</h1>
      </header>

      <div className="resource-list">
        {exercises.map((exercise) => (
          <article className="resource-row" key={exercise.id}>
            <header>
              <h2>{exercise.name}</h2>
              <span className="badge">{exercise.category}</span>
            </header>
            <div className="resource-meta">
              <span>Medición: {exercise.measurementType}</span>
            </div>

            <button onClick={() => onSelectExercise(exercise.id)}>
              Ver detalle
            </button>
          </article>
        ))}
      </div>

      {selectedExercise && (
        <section className="surface detail-section">
          <h3>Detalle del ejercicio</h3>

          <dl className="detail-data">
            <div><dt>ID</dt><dd>{selectedExercise.id}</dd></div>
            <div><dt>Nombre</dt><dd>{selectedExercise.name}</dd></div>
            <div><dt>Categoría</dt><dd>{selectedExercise.category}</dd></div>
            <div><dt>Medición</dt><dd>{selectedExercise.measurementType}</dd></div>
            <div><dt>Activo</dt><dd>{selectedExercise.active ? "Sí" : "No"}</dd></div>
          </dl>
        </section>
      )}
    </section>
  );
}

export default ExercisesView;
