import type { WodType } from "../../types/Wod";
import type { MyWodsViewProps } from "./MyWodsView.Types";

function MyWodsView({
  wods,
  exercises,
  selectedWod,
  registeringResult,
  resultPerformedAt,
  amrapRounds,
  amrapExtraReps,
  resultSuccess,
  editingWod,
  editName,
  editType,
  editRounds,
  editTimeCapSeconds,
  editItems,
  loading,
  error,
  getExercise,
  onSelectWod,
  onEditWod,
  onDeleteWod,
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
  onBack,
  onStartRegisterResult,
  onCancelRegisterResult,
  onResultPerformedAtChange,
  onAmrapRoundsChange,
  onAmrapExtraRepsChange,
  onCreateAmrapResult,
}: MyWodsViewProps) {
  if (loading) {
    return <p>Cargando tus WODs...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (editingWod) {
    return (
      <section>
        <button type="button" onClick={onCancelEdit}>
          ← Volver
        </button>

        <h1>Editar WOD</h1>

        <form onSubmit={onUpdateWod}>
          <div>
            <label htmlFor="edit-name">Nombre</label>

            <input
              id="edit-name"
              type="text"
              value={editName}
              onChange={(event) => onEditNameChange(event.target.value)}
              required
            />
          </div>

          <div>
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

          {editType === "FOR_TIME" && (
            <>
              <div>
                <label htmlFor="edit-rounds">Rondas</label>

                <input
                  id="edit-rounds"
                  type="number"
                  min="1"
                  value={editRounds ?? ""}
                  onChange={(event) =>
                    onEditRoundsChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="edit-time-cap">Tiempo límite (segundos)</label>

                <input
                  id="edit-time-cap"
                  type="number"
                  min="1"
                  value={editTimeCapSeconds ?? ""}
                  onChange={(event) =>
                    onEditTimeCapChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </div>
            </>
          )}

          {(editType === "AMRAP" || editType === "EMOM") && (
            <div>
              <label htmlFor="edit-time-cap">Duración (segundos)</label>

              <input
                id="edit-time-cap"
                type="number"
                min="1"
                value={editTimeCapSeconds ?? ""}
                onChange={(event) =>
                  onEditTimeCapChange(
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

          {editItems.map((item, index) => {
            const exercise = getExercise(item.exerciseId);

            return (
              <div key={index}>
                <h3>Ejercicio {index + 1}</h3>

                <div>
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

                {exercise?.measurementType === "REPS" && (
                  <div>
                    <label htmlFor={`edit-reps-${index}`}>Repeticiones</label>

                    <input
                      id={`edit-reps-${index}`}
                      type="number"
                      min="1"
                      value={item.reps ?? ""}
                      onChange={(event) =>
                        onEditRepsChange(
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
                      <label htmlFor={`edit-reps-${index}`}>
                        Repeticiones
                      </label>

                      <input
                        id={`edit-reps-${index}`}
                        type="number"
                        min="1"
                        value={item.reps ?? ""}
                        onChange={(event) =>
                          onEditRepsChange(
                            index,
                            event.target.value === ""
                              ? undefined
                              : Number(event.target.value),
                          )
                        }
                      />
                    </div>

                    <div>
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
                            event.target.value === ""
                              ? undefined
                              : Number(event.target.value),
                          )
                        }
                      />
                    </div>

                    <div>
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
                            event.target.value === ""
                              ? undefined
                              : Number(event.target.value),
                          )
                        }
                      />
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveEditExercise(index)}
                >
                  Eliminar ejercicio
                </button>
              </div>
            );
          })}

          <button type="button" onClick={onAddEditExercise}>
            + Añadir ejercicio
          </button>

          <button type="submit" disabled={editItems.length === 0}>
            Guardar cambios
          </button>

          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        </form>
      </section>
    );
  }

  if (selectedWod) {
    return (
      <section>
        <button type="button" onClick={onBack}>
          ← Volver
        </button>

        <h1>{selectedWod.name}</h1>

        <p>{selectedWod.version.type}</p>

        {selectedWod.version.rounds !== null && (
          <p>Rondas: {selectedWod.version.rounds}</p>
        )}

        {selectedWod.version.timeCapSeconds !== null && (
          <p>
            Tiempo límite: {Math.floor(selectedWod.version.timeCapSeconds / 60)}{" "}
            min
          </p>
        )}

        <h2>Entrenamiento</h2>

        {selectedWod.composition.map((item) => (
          <article key={item.id}>
            <strong>{item.exerciseName}</strong>

            {item.reps !== null && <p>{item.reps} repeticiones</p>}

            {item.weightKg !== null && <p>{item.weightKg} kg</p>}

            {item.distanceM !== null && <p>{item.distanceM} m</p>}

            {item.durationSeconds !== null && (
              <p>{item.durationSeconds} segundos</p>
            )}
          </article>
        ))}

        {resultSuccess && <p>{resultSuccess}</p>}

        {!registeringResult && (
          <button type="button" onClick={onStartRegisterResult}>
            Registrar resultado
          </button>
        )}

        {registeringResult && selectedWod.version.type === "AMRAP" && (
          <div>
            <h2>Registrar resultado</h2>

            <form onSubmit={onCreateAmrapResult}>
              <div>
                <label htmlFor="result-performed-at">Fecha y hora</label>

                <input
                  id="result-performed-at"
                  type="datetime-local"
                  value={resultPerformedAt}
                  onChange={(event) =>
                    onResultPerformedAtChange(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="amrap-rounds">Rondas completas</label>

                <input
                  id="amrap-rounds"
                  type="number"
                  min="0"
                  value={amrapRounds ?? ""}
                  onChange={(event) =>
                    onAmrapRoundsChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="amrap-extra-reps">Repeticiones extra</label>

                <input
                  id="amrap-extra-reps"
                  type="number"
                  min="0"
                  value={amrapExtraReps ?? ""}
                  onChange={(event) =>
                    onAmrapExtraRepsChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                  required
                />
              </div>

              <button type="submit">Guardar resultado</button>

              <button type="button" onClick={onCancelRegisterResult}>
                Cancelar
              </button>
            </form>
          </div>
        )}

        {registeringResult && selectedWod.version.type !== "AMRAP" && (
          <div>
            <h2>Registrar resultado</h2>

            <p>
              El formulario para {selectedWod.version.type} será el siguiente
              que implementemos.
            </p>

            <button type="button" onClick={onCancelRegisterResult}>
              Cancelar
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="placeholder-page">
      <h1>Mis WODs</h1>

      <p>Esta sección permitirá gestionar tus WOD personales.</p>

      {wods.map((wod) => (
        <article key={wod.id}>
          <h2>{wod.name}</h2>

          <p>{wod.version.type}</p>

          <button type="button" onClick={() => onSelectWod(wod.id)}>
            Ver WOD
          </button>

          <button type="button" onClick={() => onEditWod(wod)}>
            Editar
          </button>

          <button type="button" onClick={() => onDeleteWod(wod.id)}>
            Eliminar
          </button>
        </article>
      ))}
    </section>
  );
}

export default MyWodsView;
