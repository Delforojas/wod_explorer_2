import type { RegisterExerciseResultViewProps } from "../RegisterExerciseResultView.Types";

import ExerciseResultFields from "./ExerciseResultFields";
import ExerciseSelector from "./ExerciseSelector";

type ExerciseResultFormProps = Pick<
  RegisterExerciseResultViewProps,
  | "exercises"
  | "selectedExerciseId"
  | "selectedExercise"
  | "reps"
  | "weightKg"
  | "distanceM"
  | "durationSeconds"
  | "performedAt"
  | "submitting"
  | "onExerciseChange"
  | "onRepsChange"
  | "onWeightChange"
  | "onDistanceChange"
  | "onDurationChange"
  | "onPerformedAtChange"
  | "onSubmit"
>;

function ExerciseResultForm(props: ExerciseResultFormProps) {
  const {
    exercises,
    selectedExerciseId,
    selectedExercise,
    performedAt,
    submitting,
    onExerciseChange,
    onPerformedAtChange,
    onSubmit,
  } = props;

  return (
    <form className="exercise-result-form" onSubmit={onSubmit}>
      {/* SELECTOR DE EJERCICIO */}

      <ExerciseSelector
        exercises={exercises}
        selectedExerciseId={selectedExerciseId}
        onExerciseChange={onExerciseChange}
      />

      {selectedExercise && (
        <>
          {/* TIPO DE MEDICIÓN */}

          <p className="exercise-result-measurement">
            Tipo de medición: {selectedExercise.measurementType}
          </p>

          {/* CAMPOS DEL RESULTADO */}

          <ExerciseResultFields {...props} />

          {/* FECHA */}

          <div className="exercise-result-field">
            <label htmlFor="performedAt">Fecha y hora</label>

            <input
              id="performedAt"
              type="datetime-local"
              value={performedAt}
              onChange={(event) => onPerformedAtChange(event.target.value)}
            />
          </div>
        </>
      )}

      {/* REGISTRAR */}

      <button
        className="exercise-result-submit"
        type="submit"
        disabled={!selectedExercise || submitting}
      >
        {submitting ? "Registrando..." : "Registrar marca"}
      </button>
    </form>
  );
}

export default ExerciseResultForm;
