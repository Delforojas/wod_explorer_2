import type { ExerciseResponse } from "../../../types/Exercise";
import type { WodCompositionItemRequest } from "../../../types/Wod";

import type { CreateWodViewProps } from "../CreateWodView.Types";

type WodExerciseCardProps = Pick<
  CreateWodViewProps,
  | "exercises"
  | "onExerciseChange"
  | "onRepsChange"
  | "onWeightChange"
  | "onDistanceChange"
  | "onDurationChange"
  | "onRemoveExercise"
> & {
  item: WodCompositionItemRequest;
  exercise: ExerciseResponse | undefined;
  index: number;
  total: number;
};

function WodExerciseCard({
  item,
  exercise,
  index,
  total,
  exercises,
  onExerciseChange,
  onRepsChange,
  onWeightChange,
  onDistanceChange,
  onDurationChange,
  onRemoveExercise,
}: WodExerciseCardProps) {
  return (
    <article className="wod-exercise-card">
      {/* ENCABEZADO */}

      <header className="wod-exercise-card-header">
        <div className="wod-exercise-card-heading">
          <span className="wod-exercise-card-eyebrow">
            MOVIMIENTO {index + 1}
          </span>

          <h3>Ejercicio {index + 1}</h3>
        </div>

        <span className="wod-exercise-card-badge">
          {index + 1} / {total}
        </span>
      </header>

      {/* CAMPOS */}

      <div className="wod-exercise-card-fields">
        {/* SELECCIONAR EJERCICIO */}

        <div className="wod-exercise-card-field wod-exercise-card-field-full">
          <label htmlFor={`exercise-${index}`}>Seleccionar ejercicio</label>

          <select
            id={`exercise-${index}`}
            value={item.exerciseId}
            onChange={(event) =>
              onExerciseChange(index, Number(event.target.value))
            }
          >
            {exercises.map((availableExercise) => (
              <option key={availableExercise.id} value={availableExercise.id}>
                {availableExercise.name}
              </option>
            ))}
          </select>
        </div>

        {/* REPETICIONES */}

        {(exercise?.measurementType === "REPS" ||
          exercise?.measurementType === "WEIGHT") && (
          <div className="wod-exercise-card-field">
            <label htmlFor={`reps-${index}`}>Repeticiones</label>

            <input
              id={`reps-${index}`}
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Ej. 10"
              value={item.reps ?? ""}
              onChange={(event) =>
                onRepsChange(
                  index,
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
            />
          </div>
        )}

        {/* PESO */}

        {(exercise?.measurementType === "WEIGHT" ||
          exercise?.measurementType === "WEIGHT_DISTANCE") && (
          <div className="wod-exercise-card-field">
            <label htmlFor={`weight-${index}`}>Peso (kg)</label>

            <input
              id={`weight-${index}`}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="Ej. 40"
              value={item.weightKg ?? ""}
              onChange={(event) =>
                onWeightChange(
                  index,
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
            />
          </div>
        )}

        {/* DISTANCIA */}

        {(exercise?.measurementType === "DISTANCE" ||
          exercise?.measurementType === "WEIGHT_DISTANCE") && (
          <div className="wod-exercise-card-field">
            <label htmlFor={`distance-${index}`}>Distancia (m)</label>

            <input
              id={`distance-${index}`}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="Ej. 400"
              value={item.distanceM ?? ""}
              onChange={(event) =>
                onDistanceChange(
                  index,
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
            />
          </div>
        )}

        {/* DURACIÓN */}

        {exercise?.measurementType === "TIME" && (
          <div className="wod-exercise-card-field">
            <label htmlFor={`duration-${index}`}>Duración (segundos)</label>

            <input
              id={`duration-${index}`}
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Ej. 60"
              value={item.durationSeconds ?? ""}
              onChange={(event) =>
                onDurationChange(
                  index,
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
            />
          </div>
        )}
      </div>

      {/* ELIMINAR EJERCICIO */}

      <div className="wod-exercise-card-actions">
        <button
          className="wod-exercise-card-delete"
          type="button"
          onClick={() => onRemoveExercise(index)}
        >
          Eliminar ejercicio
        </button>
      </div>
    </article>
  );
}

export default WodExerciseCard;
