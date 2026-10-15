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
    return (
      <section className="wod-page">
        <div className="wod-container">
          <p className="wod-empty" role="status">
            Cargando ejercicios...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="wod-page">
      <div className="wod-container">
        {/* ENCABEZADO */}

        <header className="wod-header">
          <p className="wod-eyebrow">WOD PERSONAL</p>

          <h1>Crear WOD</h1>

          <p className="wod-description">
            Diseña un entrenamiento personal y configura sus ejercicios.
          </p>
        </header>

        {/* MENSAJES */}

        {error && (
          <p className="wod-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="wod-create-success" role="status">
            {success}
          </p>
        )}

        {/* FORMULARIO */}

        <form className="wod-result-form wod-create-form" onSubmit={onSubmit}>
          {/* NOMBRE */}

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

          {/* MODALIDAD */}

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

          {/* CONFIGURACIÓN FOR TIME */}

          {type === "FOR_TIME" && (
            <>
              <div className="form-field">
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

              <div className="form-field">
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

          {/* CONFIGURACIÓN AMRAP / EMOM */}

          {(type === "AMRAP" || type === "EMOM") && (
            <div className="form-field">
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

          {/* SECCIÓN DE EJERCICIOS */}

          <div className="wod-create-section-header">
            <h2>Ejercicios</h2>

            <span className="wod-badge">
              {items.length} {items.length === 1 ? "ejercicio" : "ejercicios"}
            </span>
          </div>

          {items.length === 0 && (
            <p className="wod-empty">Todavía no has añadido ejercicios.</p>
          )}

          {/* LISTADO DE EJERCICIOS */}

          {items.map((item, index) => {
            const exercise = getExercise(item.exerciseId);

            return (
              <div className="wod-create-item" key={index}>
                <div className="wod-create-item-header">
                  <h3>Ejercicio {index + 1}</h3>

                  <span className="wod-badge">
                    {index + 1} / {items.length}
                  </span>
                </div>

                {/* SELECCIÓN DEL EJERCICIO */}

                <div className="form-field">
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

                {/* EJERCICIOS POR REPETICIONES */}

                {exercise?.measurementType === "REPS" && (
                  <div className="form-field">
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

                {/* EJERCICIOS CON PESO */}

                {exercise?.measurementType === "WEIGHT" && (
                  <>
                    <div className="form-field">
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

                    <div className="form-field">
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

                {/* EJERCICIOS POR DISTANCIA */}

                {exercise?.measurementType === "DISTANCE" && (
                  <div className="form-field">
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

                {/* EJERCICIOS POR TIEMPO */}

                {exercise?.measurementType === "TIME" && (
                  <div className="form-field">
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

                {/* EJERCICIOS CON PESO Y DISTANCIA */}

                {exercise?.measurementType === "WEIGHT_DISTANCE" && (
                  <>
                    <div className="form-field">
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

                    <div className="form-field">
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

                {/* ELIMINAR EJERCICIO */}

                <button
                  className="wod-create-delete"
                  type="button"
                  onClick={() => onRemoveExercise(index)}
                >
                  Eliminar ejercicio
                </button>
              </div>
            );
          })}

          {/* AÑADIR EJERCICIO */}

          <button
            className="wod-create-add"
            type="button"
            onClick={onAddExercise}
          >
            + Añadir ejercicio
          </button>

          {/* CREAR WOD */}

          <div className="wod-result-actions">
            <button
              className="wod-card-action"
              type="submit"
              disabled={items.length === 0}
            >
              Crear WOD
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateWodView;
