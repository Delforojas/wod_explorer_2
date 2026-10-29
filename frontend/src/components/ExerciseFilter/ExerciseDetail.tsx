import type { ExercisesViewProps } from "../../views/exercises/ExercisesView.Types";

type ExerciseDetailProps = Pick<ExercisesViewProps, "selectedExercise">;

function ExerciseDetail({ selectedExercise }: ExerciseDetailProps) {
  if (!selectedExercise) {
    return null;
  }

  return (
    <section className="exercise-detail">
      <h3>Detalle del ejercicio</h3>

      <dl className="exercise-detail-data">
        {/* ID */}

        <div>
          <dt>ID</dt>
          <dd>{selectedExercise.id}</dd>
        </div>

        {/* NOMBRE */}

        <div>
          <dt>Nombre</dt>
          <dd>{selectedExercise.name}</dd>
        </div>

        {/* CATEGORÍA */}

        <div>
          <dt>Categoría</dt>
          <dd>{selectedExercise.category}</dd>
        </div>

        {/* TIPO DE MEDICIÓN */}

        <div>
          <dt>Medición</dt>
          <dd>{selectedExercise.measurementType}</dd>
        </div>

        {/* ESTADO */}

        <div>
          <dt>Activo</dt>
          <dd>{selectedExercise.active ? "Sí" : "No"}</dd>
        </div>
      </dl>
    </section>
  );
}

export default ExerciseDetail;
