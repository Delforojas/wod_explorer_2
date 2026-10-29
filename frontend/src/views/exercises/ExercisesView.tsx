import type { ExercisesViewProps } from "./ExercisesView.Types";

import ExercisesList from "../../components/ExerciseFilter/ExercisesList";
import ExerciseDetail from "../../components/ExerciseFilter/ExerciseDetail";

function ExercisesView({
  exercises,
  selectedExercise,
  loading,
  error,
}: ExercisesViewProps) {
  if (loading) {
    return (
      <section className="exercise-page">
        <p className="exercise-empty" role="status">
          Cargando ejercicios...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="exercise-page">
        <p className="exercise-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="exercise-page">
      <div className="exercise-container">
        <ExercisesList exercises={exercises} />

        {selectedExercise && (
          <ExerciseDetail selectedExercise={selectedExercise} />
        )}
      </div>
    </section>
  );
}

export default ExercisesView;
