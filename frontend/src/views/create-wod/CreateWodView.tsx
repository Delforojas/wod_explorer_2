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
      <section className="create-wod-page">
        <div className="create-wod-container">
          <p className="create-wod-loading" role="status">
            Cargando ejercicios...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="create-wod-page">
      <div className="create-wod-container">
        {/* ENCABEZADO */}

        <header className="create-wod-header">
          <p className="create-wod-eyebrow">WOD PERSONAL</p>

          <h1>Crear WOD</h1>

          <p className="create-wod-description">
            Diseña un entrenamiento personal y configura sus ejercicios.
          </p>
        </header>

        {/* MENSAJES */}

        {error && (
          <p className="create-wod-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="create-wod-success" role="status">
            {success}
          </p>
        )}

        {/* FORMULARIO PRINCIPAL */}

        <form className="create-wod-form" onSubmit={onSubmit}>
          {/* CONFIGURACIÓN DEL WOD */}

          <section className="wod-configuration">
            <header className="wod-configuration-header">
              <span className="wod-configuration-eyebrow">CONFIGURACIÓN</span>

              <h2>Configura tu entrenamiento</h2>

              <p>Define el nombre, la modalidad y la duración del WOD.</p>
            </header>

            <div className="wod-configuration-grid">
              {/* NOMBRE */}

              <div className="wod-configuration-field">
                <label htmlFor="name">Nombre del WOD</label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => onNameChange(event.target.value)}
                  placeholder="Ej. Mi entrenamiento"
                  required
                />
              </div>

              {/* MODALIDAD */}

              <div className="wod-configuration-field">
                <label htmlFor="type">Modalidad</label>

                <select
                  id="type"
                  value={type}
                  onChange={(event) =>
                    onTypeChange(event.target.value as WodType)
                  }
                >
                  <option value="FOR_TIME">For Time</option>
                  <option value="AMRAP">AMRAP</option>
                  <option value="EMOM">EMOM</option>
                </select>
              </div>

              {/* FOR TIME */}

              {type === "FOR_TIME" && (
                <>
                  <div className="wod-configuration-field">
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

                  <div className="wod-configuration-field">
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

              {/* AMRAP / EMOM */}

              {(type === "AMRAP" || type === "EMOM") && (
                <div className="wod-configuration-field">
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
            </div>
          </section>

          {/* LISTADO DE EJERCICIOS */}

          <section className="wod-exercises-list">
            <header className="wod-exercises-header">
              <div className="wod-exercises-heading">
                <span className="wod-exercises-eyebrow">
                  COMPOSICIÓN DEL WOD
                </span>

                <h2>Ejercicios</h2>

                <p>Selecciona los movimientos y configura sus cantidades.</p>
              </div>

              <span className="wod-exercises-count">
                {items.length} {items.length === 1 ? "ejercicio" : "ejercicios"}
              </span>
            </header>

            {/* ESTADO VACÍO */}

            {items.length === 0 && (
              <p className="wod-exercises-empty">
                Todavía no has añadido ejercicios.
              </p>
            )}

            {/* TARJETAS DE EJERCICIOS */}

            <div className="wod-exercises-grid">
              {items.map((item, index) => {
                const exercise = getExercise(item.exerciseId);

                return (
                  <article className="wod-exercise-card" key={index}>
                    {/* ENCABEZADO DE TARJETA */}

                    <header className="wod-exercise-card-header">
                      <h3>Ejercicio {index + 1}</h3>

                      <span className="wod-exercise-card-badge">
                        {index + 1} / {items.length}
                      </span>
                    </header>

                    {/* CAMPOS */}

                    <div className="wod-exercise-card-fields">
                      {/* SELECCIÓN DE EJERCICIO */}

                      <div className="wod-exercise-card-field">
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

                      {/* REPETICIONES */}

                      {(exercise?.measurementType === "REPS" ||
                        exercise?.measurementType === "WEIGHT") && (
                        <div className="wod-exercise-card-field">
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
                          <label htmlFor={`distance-${index}`}>
                            Distancia (m)
                          </label>

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

                      {/* DURACIÓN */}

                      {exercise?.measurementType === "TIME" && (
                        <div className="wod-exercise-card-field">
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
                    </div>

                    {/* ELIMINAR EJERCICIO */}

                    <button
                      className="wod-exercise-card-delete"
                      type="button"
                      onClick={() => onRemoveExercise(index)}
                    >
                      Eliminar ejercicio
                    </button>
                  </article>
                );
              })}
            </div>

            {/* AÑADIR EJERCICIO */}

            <button
              className="wod-exercises-add"
              type="button"
              onClick={onAddExercise}
              disabled={exercises.length === 0}
            >
              + Añadir ejercicio
            </button>
          </section>

          {/* ACCIONES DEL FORMULARIO */}

          <div className="create-wod-form-actions">
            <button
              className="create-wod-form-submit"
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
