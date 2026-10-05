import type { WodType } from "../../types/Wod";
import type { CreateWodViewProps } from "./CreateWodView.Types";

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
    return <p className="ui-loading">Cargando ejercicios...</p>;
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">WOD personal</p>
        <h1>Crear WOD</h1>
        <p>Crea un nuevo entrenamiento personal.</p>
      </header>

      {error && <p className="ui-error" role="alert">{error}</p>}
      {success && <p className="ui-success">{success}</p>}

      <form className="form-layout surface" onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="name">Nombre</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
        </div>

        <div className="form-field">
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

        {items.length === 0 && <p className="ui-empty">Todavía no has añadido ejercicios.</p>}

        {items.map((item, index) => {
          const exercise = getExercise(item.exerciseId);

          return (
            <div className="repeatable-item" key={index}>
              <h3>Ejercicio {index + 1}</h3>

              <div>
                <label htmlFor={`exercise-${index}`}>Ejercicio</label>

                <select
                  id={`exercise-${index}`}
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
                  <label htmlFor={`reps-${index}`}>Repeticiones</label>

                  <input
                    id={`reps-${index}`}
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
                    <label htmlFor={`reps-${index}`}>Repeticiones</label>

                    <input
                      id={`reps-${index}`}
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
                    <label htmlFor={`weight-${index}`}>Peso (kg)</label>

                    <input
                      id={`weight-${index}`}
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
                  <label htmlFor={`distance-${index}`}>Distancia (m)</label>

                  <input
                    id={`distance-${index}`}
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
                  <label htmlFor={`duration-${index}`}>
                    Duración (segundos)
                  </label>

                  <input
                    id={`duration-${index}`}
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
                    <label htmlFor={`weight-${index}`}>Peso (kg)</label>

                    <input
                      id={`weight-${index}`}
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
                    <label htmlFor={`distance-${index}`}>Distancia (m)</label>

                    <input
                      id={`distance-${index}`}
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

              <button className="button-destructive" type="button" onClick={() => onRemoveExercise(index)}>
                Eliminar ejercicio
              </button>
            </div>
          );
        })}

        <button className="button-secondary" type="button" onClick={onAddExercise}>
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
