import type { RegisterWodResultViewProps } from "../RegisterWodResultView.Types";

type ForTimeResultFieldsProps = Pick<
  RegisterWodResultViewProps,
  "selectedWod" | "values" | "onChange"
>;

function ForTimeResultFields({
  selectedWod,
  values,
  onChange,
}: ForTimeResultFieldsProps) {
  if (!selectedWod) {
    return null;
  }

  return (
    <div className="for-time-result-fields">
      {/* ENCABEZADO */}

      <header className="for-time-result-header">
        <span className="for-time-result-eyebrow">MODALIDAD FOR TIME</span>

        <h2>Resultado FOR_TIME</h2>

        <p>
          Registra tu tiempo final o indica hasta dónde llegaste si no
          completaste el entrenamiento.
        </p>
      </header>

      {/* ESTADO DEL ENTRENAMIENTO */}

      <div className="for-time-result-field">
        <label htmlFor="for-time-completed">Estado del entrenamiento</label>

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

      {/* FOR TIME COMPLETADO */}

      {values.completed ? (
        <div className="for-time-result-section">
          <div className="for-time-result-section-header">
            <span className="for-time-result-section-label">
              ENTRENAMIENTO COMPLETADO
            </span>

            <p>
              Introduce el tiempo total que has necesitado para terminar el WOD.
            </p>
          </div>

          <div className="for-time-result-field">
            <label htmlFor="for-time-seconds">Tiempo empleado (segundos)</label>

            <input
              id="for-time-seconds"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Ej. 540"
              value={values.timeSeconds}
              onChange={(event) => onChange("timeSeconds", event.target.value)}
              required
            />
          </div>
        </div>
      ) : (
        /* FOR TIME NO COMPLETADO */

        <div className="for-time-result-section">
          <div className="for-time-result-section-header">
            <span className="for-time-result-section-label">
              ENTRENAMIENTO NO COMPLETADO
            </span>

            <p>
              Indica las rondas completadas, el ejercicio alcanzado y la
              cantidad realizada.
            </p>
          </div>

          <div className="for-time-result-grid">
            {/* RONDAS COMPLETADAS */}

            <div className="for-time-result-field">
              <label htmlFor="progress-rounds">Rondas completadas</label>

              <input
                id="progress-rounds"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="0"
                value={values.progressRounds}
                onChange={(event) =>
                  onChange("progressRounds", event.target.value)
                }
                required
              />
            </div>

            {/* EJERCICIO ALCANZADO */}

            <div className="for-time-result-field">
              <label htmlFor="progress-item">Ejercicio alcanzado</label>

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

            {/* REPETICIONES REALIZADAS */}

            <div className="for-time-result-field">
              <label htmlFor="progress-reps">Repeticiones realizadas</label>

              <input
                id="progress-reps"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="0"
                value={values.progressReps}
                onChange={(event) =>
                  onChange("progressReps", event.target.value)
                }
              />
            </div>

            {/* DISTANCIA REALIZADA */}

            <div className="for-time-result-field">
              <label htmlFor="progress-distance">Distancia realizada (m)</label>

              <input
                id="progress-distance"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0"
                value={values.progressDistanceM}
                onChange={(event) =>
                  onChange("progressDistanceM", event.target.value)
                }
              />
            </div>

            {/* DURACIÓN REALIZADA */}

            <div className="for-time-result-field">
              <label htmlFor="progress-duration">
                Duración realizada (segundos)
              </label>

              <input
                id="progress-duration"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="0"
                value={values.progressDurationSeconds}
                onChange={(event) =>
                  onChange("progressDurationSeconds", event.target.value)
                }
              />
            </div>
          </div>

          <p className="for-time-result-help">
            Introduce al menos una cantidad realizada: repeticiones, distancia o
            duración.
          </p>
        </div>
      )}
    </div>
  );
}

export default ForTimeResultFields;
