import { Link } from "react-router-dom";

import type { RegisterWodResultViewProps } from "../RegisterWodResultView.Types";

import WodResultSelected from "./WodResultSelected";
import AmrapResultFields from "./AmrapResultFields";
import ForTimeResultFields from "./ForTimeResultFields";
import EmomResultFields from "./EmomResultFields";

type WodResultFormProps = Pick<
  RegisterWodResultViewProps,
  "wods" | "selectedWod" | "values" | "saving" | "onChange" | "onSubmit"
>;

function WodResultForm({
  wods,
  selectedWod,
  values,
  saving,
  onChange,
  onSubmit,
}: WodResultFormProps) {
  return (
    <form className="wod-register-form" onSubmit={onSubmit}>
      {/* SELECCIONAR WOD */}

      <div className="wod-register-form-section">
        <header className="wod-register-form-header">
          <span className="wod-register-form-eyebrow">
            SELECCIONAR ENTRENAMIENTO
          </span>

          <h2>Elige tu WOD</h2>

          <p>
            Selecciona el entrenamiento del que quieres registrar un resultado.
          </p>
        </header>

        <div className="wod-register-form-field">
          <label htmlFor="result-wod">Seleccionar WOD</label>

          <select
            id="result-wod"
            value={values.wodVersionId}
            onChange={(event) =>
              onChange("wodVersionId", event.target.value)
            }
            required
          >
            <option value="">Selecciona un entrenamiento</option>

            {wods.map((wod) => (
              <option key={wod.version.id} value={wod.version.id}>
                {wod.name} — versión {wod.version.versionNumber} — {wod.version.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedWod && (
        <>
          {/* INFORMACIÓN DEL WOD */}

          <WodResultSelected wod={selectedWod} />

          {/* FECHA Y HORA */}

          <div className="wod-register-form-section">
            <header className="wod-register-form-header">
              <span className="wod-register-form-eyebrow">
                FECHA DEL ENTRENAMIENTO
              </span>

              <h2>¿Cuándo lo realizaste?</h2>

              <p>Indica la fecha y hora en la que realizaste el WOD.</p>
            </header>

            <div className="wod-register-form-field">
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
          </div>

          {/* CAMPOS SEGÚN MODALIDAD */}

          {selectedWod.version.type === "AMRAP" && (
            <AmrapResultFields values={values} onChange={onChange} />
          )}

          {selectedWod.version.type === "FOR_TIME" && (
            <ForTimeResultFields
              selectedWod={selectedWod}
              values={values}
              onChange={onChange}
            />
          )}

          {selectedWod.version.type === "EMOM" && (
            <EmomResultFields values={values} onChange={onChange} />
          )}

          {/* ACCIONES */}

          <div className="wod-register-form-actions">
            <button
              type="submit"
              className="wod-register-form-submit"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar resultado"}
            </button>

            <Link to="/my-wod-results" className="wod-register-form-cancel">
              Cancelar
            </Link>
          </div>
        </>
      )}
    </form>
  );
}

export default WodResultForm;
