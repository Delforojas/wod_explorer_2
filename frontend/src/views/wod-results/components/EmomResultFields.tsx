import type { RegisterWodResultViewProps } from "../RegisterWodResultView.Types";

type EmomResultFieldsProps = Pick<
  RegisterWodResultViewProps,
  "values" | "onChange"
>;

function EmomResultFields({ values, onChange }: EmomResultFieldsProps) {
  return (
    <div className="emom-result-fields">
      {/* ENCABEZADO */}

      <header className="emom-result-header">
        <span className="emom-result-eyebrow">MODALIDAD EMOM</span>

        <h2>Resultado EMOM</h2>

        <p>
          Indica si has completado todas las rondas del entrenamiento dentro del
          tiempo establecido.
        </p>
      </header>

      {/* ESTADO DEL ENTRENAMIENTO */}

      <div className="emom-result-field">
        <label htmlFor="emom-completed">Estado del entrenamiento</label>

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
    </div>
  );
}

export default EmomResultFields;
