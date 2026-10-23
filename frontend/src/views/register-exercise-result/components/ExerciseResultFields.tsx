import type { RegisterExerciseResultViewProps } from "../RegisterExerciseResultView.Types";

type ExerciseResultFieldsProps = Pick<
  RegisterExerciseResultViewProps,
  | "selectedExercise"
  | "reps"
  | "weightKg"
  | "distanceM"
  | "durationSeconds"
  | "onRepsChange"
  | "onWeightChange"
  | "onDistanceChange"
  | "onDurationChange"
>;

function ExerciseResultFields({
  selectedExercise,
  reps,
  weightKg,
  distanceM,
  durationSeconds,
  onRepsChange,
  onWeightChange,
  onDistanceChange,
  onDurationChange,
}: ExerciseResultFieldsProps) {
  if (!selectedExercise) {
    return null;
  }

  const measurementType = selectedExercise.measurementType;

  // TRANSFORMAR EL INPUT EN NÚMERO

  function parseNumber(value: string): number | undefined {
    return value === "" ? undefined : Number(value);
  }

  const showReps = measurementType === "REPS" || measurementType === "WEIGHT";

  const showWeight =
    measurementType === "WEIGHT" || measurementType === "WEIGHT_DISTANCE";

  const showDistance =
    measurementType === "DISTANCE" ||
    measurementType === "DISTANCE_TIME" ||
    measurementType === "WEIGHT_DISTANCE";

  const showDuration =
    measurementType === "TIME" || measurementType === "DISTANCE_TIME";

  return (
    <div className="exercise-result-fields">
      {/* REPETICIONES */}

      {showReps && (
        <div className="exercise-result-field">
          <label htmlFor="reps">Repeticiones</label>

          <input
            id="reps"
            type="number"
            min="0"
            value={reps ?? ""}
            onChange={(event) => onRepsChange(parseNumber(event.target.value))}
          />
        </div>
      )}

      {/* PESO */}

      {showWeight && (
        <div className="exercise-result-field">
          <label htmlFor="weightKg">Peso (kg)</label>

          <input
            id="weightKg"
            type="number"
            min="0"
            step="0.01"
            value={weightKg ?? ""}
            onChange={(event) =>
              onWeightChange(parseNumber(event.target.value))
            }
          />
        </div>
      )}

      {/* DISTANCIA */}

      {showDistance && (
        <div className="exercise-result-field">
          <label htmlFor="distanceM">Distancia (m)</label>

          <input
            id="distanceM"
            type="number"
            min="0"
            step="0.01"
            value={distanceM ?? ""}
            onChange={(event) =>
              onDistanceChange(parseNumber(event.target.value))
            }
          />
        </div>
      )}

      {/* DURACIÓN */}

      {showDuration && (
        <div className="exercise-result-field">
          <label htmlFor="durationSeconds">Duración (segundos)</label>

          <input
            id="durationSeconds"
            type="number"
            min="0"
            value={durationSeconds ?? ""}
            onChange={(event) =>
              onDurationChange(parseNumber(event.target.value))
            }
          />
        </div>
      )}
    </div>
  );
}

export default ExerciseResultFields;
