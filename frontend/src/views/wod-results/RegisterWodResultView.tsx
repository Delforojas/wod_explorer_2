import type { FormEventHandler } from "react";
import { Link } from "react-router-dom";

import type { WodAggregateResponse } from "../../types/Wod";
import MyWodsNavigation from "../../components/layout/MyWodsNavigation";

export interface WodResultFormValues {
  wodId: string;
  performedAt: string;
  completed: boolean;
  timeSeconds: string;
  progressRounds: string;
  progressItemId: string;
  progressReps: string;
  progressDistanceM: string;
  progressDurationSeconds: string;
  amrapRounds: string;
  amrapExtraReps: string;
}

interface RegisterWodResultViewProps {
  wods: WodAggregateResponse[];
  selectedWod: WodAggregateResponse | null;
  values: WodResultFormValues;
  loading: boolean;
  saving: boolean;
  error: string | null;
  onChange: (field: keyof WodResultFormValues, value: string | boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

function RegisterWodResultView({
  wods,
  selectedWod,
  values,
  loading,
  saving,
  error,
  onChange,
  onSubmit,
}: RegisterWodResultViewProps) {
  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Mis entrenamientos</p>

        <h1>Registrar resultado</h1>

        <p>Selecciona un WOD y registra el resultado de tu entrenamiento.</p>
      </header>

      <MyWodsNavigation />

      {loading ? (
        <p className="ui-loading">Cargando entrenamientos...</p>
      ) : (
        <>
          {error && (
            <p className="ui-error" role="alert">
              {error}
            </p>
          )}

          {wods.length === 0 ? (
            <div className="surface glass-panel">
              <p className="ui-empty">
                Todavía no tienes WODs personales disponibles.
              </p>

              <Link to="/create-wod" className="marks-nav-link">
                + Crear WOD
              </Link>
            </div>
          ) : (
            <form
              className="form-layout surface glass-panel"
              onSubmit={onSubmit}
            >
              {/* Seleccionar WOD */}

              <div className="form-field">
                <label htmlFor="result-wod">Seleccionar WOD</label>

                <select
                  id="result-wod"
                  value={values.wodId}
                  onChange={(event) => onChange("wodId", event.target.value)}
                  required
                >
                  <option value="">Selecciona un entrenamiento</option>

                  {wods.map((wod) => (
                    <option key={wod.id} value={wod.id}>
                      {wod.name} — {wod.version.type}
                    </option>
                  ))}
                </select>
              </div>

              {selectedWod && (
                <>
                  {/* Información del entrenamiento */}

                  <div className="resource-row resource-row-static">
                    <header>
                      <h2>{selectedWod.name}</h2>

                      <span className="badge">{selectedWod.version.type}</span>
                    </header>

                    <p className="resource-meta">
                      Versión {selectedWod.version.versionNumber}
                    </p>

                    {selectedWod.version.timeCapSeconds !== null && (
                      <p className="resource-meta">
                        Duración: {selectedWod.version.timeCapSeconds} segundos
                      </p>
                    )}
                  </div>

                  {/* Fecha */}

                  <div className="form-field">
                    <label htmlFor="result-date">Fecha y hora</label>

                    <input
                      id="result-date"
                      type="datetime-local"
                      value={values.performedAt}
                      onChange={(event) =>
                        onChange("performedAt", event.target.value)
                      }
                      required
                    />
                  </div>

                  {/* AMRAP */}

                  {selectedWod.version.type === "AMRAP" && (
                    <>
                      <h2>Resultado AMRAP</h2>

                      <div className="form-field">
                        <label htmlFor="amrap-rounds">Rondas completas</label>

                        <input
                          id="amrap-rounds"
                          type="number"
                          min="0"
                          step="1"
                          value={values.amrapRounds}
                          onChange={(event) =>
                            onChange("amrapRounds", event.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="amrap-extra-reps">
                          Repeticiones adicionales
                        </label>

                        <input
                          id="amrap-extra-reps"
                          type="number"
                          min="0"
                          step="1"
                          value={values.amrapExtraReps}
                          onChange={(event) =>
                            onChange("amrapExtraReps", event.target.value)
                          }
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* FOR TIME */}

                  {selectedWod.version.type === "FOR_TIME" && (
                    <>
                      <h2>Resultado FOR_TIME</h2>

                      <div className="form-field">
                        <label htmlFor="for-time-completed">
                          Estado del entrenamiento
                        </label>

                        <select
                          id="for-time-completed"
                          value={values.completed ? "true" : "false"}
                          onChange={(event) =>
                            onChange("completed", event.target.value === "true")
                          }
                        >
                          <option value="true">Completado</option>

                          <option value="false">No completado</option>
                        </select>
                      </div>

                      {values.completed ? (
                        <div className="form-field">
                          <label htmlFor="for-time-seconds">
                            Tiempo empleado (segundos)
                          </label>

                          <input
                            id="for-time-seconds"
                            type="number"
                            min="1"
                            step="1"
                            value={values.timeSeconds}
                            onChange={(event) =>
                              onChange("timeSeconds", event.target.value)
                            }
                            required
                          />
                        </div>
                      ) : (
                        <>
                          <div className="form-field">
                            <label htmlFor="progress-rounds">
                              Rondas completadas
                            </label>

                            <input
                              id="progress-rounds"
                              type="number"
                              min="0"
                              step="1"
                              value={values.progressRounds}
                              onChange={(event) =>
                                onChange("progressRounds", event.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="progress-item">
                              Ejercicio alcanzado
                            </label>

                            <select
                              id="progress-item"
                              value={values.progressItemId}
                              onChange={(event) =>
                                onChange("progressItemId", event.target.value)
                              }
                              required
                            >
                              <option value="">Selecciona un ejercicio</option>

                              {[...selectedWod.composition]
                                .sort((a, b) => a.position - b.position)
                                .map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.position}. {item.exerciseName}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="form-field">
                            <label htmlFor="progress-reps">
                              Repeticiones realizadas
                            </label>

                            <input
                              id="progress-reps"
                              type="number"
                              min="0"
                              step="1"
                              value={values.progressReps}
                              onChange={(event) =>
                                onChange("progressReps", event.target.value)
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="progress-distance">
                              Distancia realizada (m)
                            </label>

                            <input
                              id="progress-distance"
                              type="number"
                              min="0"
                              step="any"
                              value={values.progressDistanceM}
                              onChange={(event) =>
                                onChange(
                                  "progressDistanceM",
                                  event.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="progress-duration">
                              Duración realizada (segundos)
                            </label>

                            <input
                              id="progress-duration"
                              type="number"
                              min="0"
                              step="1"
                              value={values.progressDurationSeconds}
                              onChange={(event) =>
                                onChange(
                                  "progressDurationSeconds",
                                  event.target.value,
                                )
                              }
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* EMOM */}

                  {selectedWod.version.type === "EMOM" && (
                    <>
                      <h2>Resultado EMOM</h2>

                      <div className="form-field">
                        <label htmlFor="emom-completed">
                          Estado del entrenamiento
                        </label>

                        <select
                          id="emom-completed"
                          value={values.completed ? "true" : "false"}
                          onChange={(event) =>
                            onChange("completed", event.target.value === "true")
                          }
                        >
                          <option value="true">Completado</option>

                          <option value="false">No completado</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Acciones */}

                  <div className="marks-navigation">
                    <button
                      type="submit"
                      className="marks-nav-link"
                      disabled={saving}
                    >
                      {saving ? "Guardando..." : "Guardar resultado"}
                    </button>

                    <Link to="/my-wod-results" className="marks-nav-link">
                      Cancelar
                    </Link>
                  </div>
                </>
              )}
            </form>
          )}
        </>
      )}
    </section>
  );
}

export default RegisterWodResultView;
