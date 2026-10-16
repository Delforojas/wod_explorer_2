import type { WodType } from "../../../types/Wod";
import type { CreateWodViewProps } from "../CreateWodView.Types";

type WodConfigurationProps = Pick<
  CreateWodViewProps,
  | "name"
  | "type"
  | "rounds"
  | "timeCapSeconds"
  | "onNameChange"
  | "onTypeChange"
  | "onRoundsChange"
  | "onTimeCapChange"
>;

function WodConfiguration({
  name,
  type,
  rounds,
  timeCapSeconds,
  onNameChange,
  onTypeChange,
  onRoundsChange,
  onTimeCapChange,
}: WodConfigurationProps) {
  return (
    <section
      className="wod-configuration"
      aria-labelledby="wod-configuration-title"
    >
      {/* ENCABEZADO */}

      <header className="wod-configuration-header">
        <span className="wod-configuration-eyebrow">CONFIGURACIÓN</span>

        <h2 id="wod-configuration-title">Configura tu entrenamiento</h2>

        <p className="wod-configuration-description">
          Define el nombre, la modalidad y la duración de tu WOD.
        </p>
      </header>

      {/* CAMPOS DE CONFIGURACIÓN */}

      <div className="wod-configuration-grid">
        {/* NOMBRE DEL WOD */}

        <div className="wod-configuration-field">
          <label htmlFor="name">Nombre del WOD</label>

          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Ej. Mi entrenamiento"
            maxLength={100}
            required
          />
        </div>

        {/* MODALIDAD */}

        <div className="wod-configuration-field">
          <label htmlFor="type">Modalidad</label>

          <select
            id="type"
            name="type"
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
            <div className="wod-configuration-field">
              <label htmlFor="rounds">Rondas</label>

              <input
                id="rounds"
                name="rounds"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="Ej. 5"
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
                name="timeCapSeconds"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="Ej. 1200"
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
          <div className="wod-configuration-field">
            <label htmlFor="time-cap">Duración (segundos)</label>

            <input
              id="time-cap"
              name="timeCapSeconds"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Ej. 900"
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
  );
}

export default WodConfiguration;
