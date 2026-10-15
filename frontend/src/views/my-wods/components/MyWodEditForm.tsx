import type { WodType } from "../../../types/Wod";
import type { MyWodsViewProps } from "../MyWodsView.Types";

type MyWodEditFormProps = Pick<
  MyWodsViewProps,
  | "exercises"
  | "editName"
  | "editType"
  | "editRounds"
  | "editTimeCapSeconds"
  | "editItems"
  | "getExercise"
  | "onCancelEdit"
  | "onEditNameChange"
  | "onEditTypeChange"
  | "onEditRoundsChange"
  | "onEditTimeCapChange"
  | "onEditExerciseChange"
  | "onEditRepsChange"
  | "onEditWeightChange"
  | "onEditDistanceChange"
  | "onEditDurationChange"
  | "onAddEditExercise"
  | "onRemoveEditExercise"
  | "onUpdateWod"
>;

function MyWodEditForm({
  exercises,
  editName,
  editType,
  editRounds,
  editTimeCapSeconds,
  editItems,
  getExercise,
  onCancelEdit,
  onEditNameChange,
  onEditTypeChange,
  onEditRoundsChange,
  onEditTimeCapChange,
  onEditExerciseChange,
  onEditRepsChange,
  onEditWeightChange,
  onEditDistanceChange,
  onEditDurationChange,
  onAddEditExercise,
  onRemoveEditExercise,
  onUpdateWod,
}: MyWodEditFormProps) {
  function parseNumber(value: string): number | undefined {
    return value === "" ? undefined : Number(value);
  }

  return (
    <section className="page my-wod-edit-page">
      {/* BOTÓN VOLVER */}

      <button
        className="button-tertiary back-button"
        type="button"
        onClick={onCancelEdit}
      >
        ← Volver
      </button>

      <h1>Editar WOD</h1>

      <form className="form-layout surface glass-panel" onSubmit={onUpdateWod}>
        {/* NOMBRE */}

        <div className="form-field">
          <label htmlFor="edit-name">Nombre</label>

          <input
            id="edit-name"
            type="text"
            value={editName}
            onChange={(event) => onEditNameChange(event.target.value)}
            required
          />
        </div>

        {/* MODALIDAD */}

        <div className="form-field">
          <label htmlFor="edit-type">Modalidad</label>

          <select
            id="edit-type"
            value={editType}
            onChange={(event) =>
              onEditTypeChange(event.target.value as WodType)
            }
          >
            <option value="FOR_TIME">For Time</option>

            <option value="AMRAP">AMRAP</option>

            <option value="EMOM">EMOM</option>
          </select>
        </div>

        {/* FOR TIME */}

        {editType === "FOR_TIME" && (
          <>
            <div className="form-field">
              <label htmlFor="edit-rounds">Rondas</label>

              <input
                id="edit-rounds"
                type="number"
                min="1"
                value={editRounds ?? ""}
                onChange={(event) =>
                  onEditRoundsChange(parseNumber(event.target.value))
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-time-cap">Tiempo límite (segundos)</label>

              <input
                id="edit-time-cap"
                type="number"
                min="1"
                value={editTimeCapSeconds ?? ""}
                onChange={(event) =>
                  onEditTimeCapChange(parseNumber(event.target.value))
                }
              />
            </div>
          </>
        )}

        {/* AMRAP / EMOM */}

        {(editType === "AMRAP" || editType === "EMOM") && (
          <div className="form-field">
            <label htmlFor="edit-time-cap">Duración (segundos)</label>

            <input
              id="edit-time-cap"
              type="number"
              min="1"
              value={editTimeCapSeconds ?? ""}
              onChange={(event) =>
                onEditTimeCapChange(parseNumber(event.target.value))
              }
              required
            />
          </div>
        )}

        {/* EJERCICIOS */}

        <h2>Ejercicios</h2>

        {editItems.map((item, index) => {
          const exercise = getExercise(item.exerciseId);

          return (
            <div className="repeatable-item" key={index}>
              <h3>Ejercicio {index + 1}</h3>

              {/* SELECTOR */}

              <div className="form-field">
                <label htmlFor={`edit-exercise-${index}`}>Ejercicio</label>

                <select
                  id={`edit-exercise-${index}`}
                  value={item.exerciseId}
                  onChange={(event) =>
                    onEditExerciseChange(index, Number(event.target.value))
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

              {/* REPETICIONES */}

              {exercise?.measurementType === "REPS" && (
                <div className="form-field">
                  <label htmlFor={`edit-reps-${index}`}>Repeticiones</label>

                  <input
                    id={`edit-reps-${index}`}
                    type="number"
                    min="1"
                    value={item.reps ?? ""}
                    onChange={(event) =>
                      onEditRepsChange(index, parseNumber(event.target.value))
                    }
                  />
                </div>
              )}

              {/* PESO */}

              {exercise?.measurementType === "WEIGHT" && (
                <>
                  <div className="form-field">
                    <label htmlFor={`edit-reps-${index}`}>Repeticiones</label>

                    <input
                      id={`edit-reps-${index}`}
                      type="number"
                      min="1"
                      value={item.reps ?? ""}
                      onChange={(event) =>
                        onEditRepsChange(index, parseNumber(event.target.value))
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor={`edit-weight-${index}`}>Peso (kg)</label>

                    <input
                      id={`edit-weight-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.weightKg ?? ""}
                      onChange={(event) =>
                        onEditWeightChange(
                          index,
                          parseNumber(event.target.value),
                        )
                      }
                    />
                  </div>
                </>
              )}

              {/* DISTANCIA */}

              {exercise?.measurementType === "DISTANCE" && (
                <div className="form-field">
                  <label htmlFor={`edit-distance-${index}`}>
                    Distancia (m)
                  </label>

                  <input
                    id={`edit-distance-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.distanceM ?? ""}
                    onChange={(event) =>
                      onEditDistanceChange(
                        index,
                        parseNumber(event.target.value),
                      )
                    }
                  />
                </div>
              )}

              {/* TIEMPO */}

              {exercise?.measurementType === "TIME" && (
                <div className="form-field">
                  <label htmlFor={`edit-duration-${index}`}>
                    Duración (segundos)
                  </label>

                  <input
                    id={`edit-duration-${index}`}
                    type="number"
                    min="1"
                    value={item.durationSeconds ?? ""}
                    onChange={(event) =>
                      onEditDurationChange(
                        index,
                        parseNumber(event.target.value),
                      )
                    }
                  />
                </div>
              )}

              {/* PESO + DISTANCIA */}

              {exercise?.measurementType === "WEIGHT_DISTANCE" && (
                <>
                  <div className="form-field">
                    <label htmlFor={`edit-weight-${index}`}>Peso (kg)</label>

                    <input
                      id={`edit-weight-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.weightKg ?? ""}
                      onChange={(event) =>
                        onEditWeightChange(
                          index,
                          parseNumber(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor={`edit-distance-${index}`}>
                      Distancia (m)
                    </label>

                    <input
                      id={`edit-distance-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.distanceM ?? ""}
                      onChange={(event) =>
                        onEditDistanceChange(
                          index,
                          parseNumber(event.target.value),
                        )
                      }
                    />
                  </div>
                </>
              )}

              {/* ELIMINAR EJERCICIO */}

              <button
                className="button-destructive"
                type="button"
                onClick={() => onRemoveEditExercise(index)}
              >
                Eliminar ejercicio
              </button>
            </div>
          );
        })}

        {/* AÑADIR EJERCICIO */}

        <button
          className="button-secondary"
          type="button"
          onClick={onAddEditExercise}
        >
          + Añadir ejercicio
        </button>

        {/* GUARDAR */}

        <button type="submit" disabled={editItems.length === 0}>
          Guardar cambios
        </button>

        {/* CANCELAR */}

        <button
          className="button-secondary"
          type="button"
          onClick={onCancelEdit}
        >
          Cancelar
        </button>
      </form>
    </section>
  );
}

export default MyWodEditForm;
