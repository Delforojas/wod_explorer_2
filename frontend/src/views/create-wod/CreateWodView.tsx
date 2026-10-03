import type { FormEvent } from "react";
import type { ExerciseResponse } from "../../types/Exercise";
import type {
  WodCompositionItemRequest,
  WodType,
} from "../../types/Wod";

interface CreateWodViewProps {
  exercises: ExerciseResponse[];
  name: string;
  type: WodType;
  rounds: number | undefined;
  timeCapSeconds: number | undefined;
  items: WodCompositionItemRequest[];
  loading: boolean;
  error: string | null;
  success: string | null;
  getExercise: (exerciseId: number) => ExerciseResponse | undefined;
  onNameChange: (value: string) => void;
  onTypeChange: (value: WodType) => void;
  onRoundsChange: (value: number | undefined) => void;
  onTimeCapChange: (value: number | undefined) => void;
  onExerciseChange: (index: number, exerciseId: number) => void;
  onRepsChange: (index: number, reps: number | undefined) => void;
  onWeightChange: (index: number, weightKg: number | undefined) => void;
  onDistanceChange: (index: number, distanceM: number | undefined) => void;
  onDurationChange: (index: number, durationSeconds: number | undefined) => void;
  onAddExercise: () => void;
  onRemoveExercise: (index: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function CreateWodView({
  exercises,
  name,
  type,
  rounds,
  timeCapSeconds,
  items,
  loading,
  error,
  success,
  getExercise,
  onNameChange,
  onTypeChange,
  onRoundsChange,
  onTimeCapChange,
  onExerciseChange,
  onRepsChange,
  onWeightChange,
  onDistanceChange,
  onDurationChange,
  onAddExercise,
  onRemoveExercise,
  onSubmit,
}: CreateWodViewProps) {
  if (loading) {
    return <p>Cargando ejercicios...</p>;
  }

  return (
    <section>
      <header>
        <h1>Crear WOD</h1>
        <p>Crea un nuevo entrenamiento personal.</p>
      </header>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="type">Modalidad</label>

          <select
            id="type"
            value={type}
            onChange={(event) => onTypeChange(event.target.value as WodType)}
          >
            <option value="FOR_TIME">For Time</option>
            <option value="AMRAP">AMRAP</option>
            <option value="EMOM">EMOM</option>
          </select>
        </div>

        {type === "FOR_TIME" && (
          <>
            <div>
              <label htmlFor="rounds">Rondas</label>

              <input
                id="rounds"
                type="number"
                min="1"
                value={rounds ?? ""}
                onChange={(event) =>
                  onRoundsChange(
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                  )
                }
              />
            </div>

            <div>
              <label htmlFor="time-cap">Tiempo límite (segundos)</label>

              <input
                id="time-cap"
                type="number"
                min="1"
                value={timeCapSeconds ?? ""}
                onChange={(event) =>
                  onTimeCapChange(
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                  )
                }
              />
            </div>
          </>
        )}

        {(type === "AMRAP" || type === "EMOM") && (
          <div>
            <label htmlFor="time-cap">Duración (segundos)</label>

            <input
              id="time-cap"
              type="number"
              min="1"
              value={timeCapSeconds ?? ""}
              onChange={(event) =>
                onTimeCapChange(
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
              required
            />
          </div>
        )}

        <h2>Ejercicios</h2>

        {items.length === 0 && <p>Todavía no has añadido ejercicios.</p>}

        {items.map((item, index) => {
          const exercise = getExercise(item.exerciseId);

          return (
            <div key={index}>
              <h3>Ejercicio {index + 1}</h3>

              <div>
                <label>Ejercicio</label>

                <select
                  value={item.exerciseId}
                  onChange={(event) =>
                    onExerciseChange(index, Number(event.target.value))
                  }
                >
                  {exercises.map((availableExercise) => (
                    <option
                      key={availableExercise.id}
                      value={availableExercise.id}
                    >
                      {availableExercise.name}
                    </option>
                  ))}
                </select>
              </div>

              {exercise?.measurementType === "REPS" && (
                <div>
                  <label>Repeticiones</label>

                  <input
                    type="number"
                    min="1"
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

              {exercise?.measurementType === "WEIGHT" && (
                <>
                  <div>
                    <label>Repeticiones</label>

                    <input
                      type="number"
                      min="1"
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

                  <div>
                    <label>Peso (kg)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
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
                </>
              )}

              {exercise?.measurementType === "DISTANCE" && (
                <div>
                  <label>Distancia (m)</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
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

              {exercise?.measurementType === "TIME" && (
                <div>
                  <label>Duración (segundos)</label>

                  <input
                    type="number"
                    min="1"
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

              {exercise?.measurementType === "WEIGHT_DISTANCE" && (
                <>
                  <div>
                    <label>Peso (kg)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
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

                  <div>
                    <label>Distancia (m)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
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
                </>
              )}

              <button type="button" onClick={() => onRemoveExercise(index)}>
                Eliminar ejercicio
              </button>
            </div>
          );
        })}

        <button type="button" onClick={onAddExercise}>
          + Añadir ejercicio
        </button>

        <button type="submit" disabled={items.length === 0}>
          Crear WOD
        </button>
      </form>
    </section>
  );
}

export default CreateWodView;
