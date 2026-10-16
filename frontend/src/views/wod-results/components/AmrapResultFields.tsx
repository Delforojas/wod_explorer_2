import type { RegisterWodResultViewProps } from "../RegisterWodResultView.Types";

type AmrapResultFieldsProps = Pick<
  RegisterWodResultViewProps,
  "values" | "onChange"
>;

function AmrapResultFields({ values, onChange }: AmrapResultFieldsProps) {
  return (
    <div className="amrap-result-fields">
      <header className="amrap-result-header">
        <span className="amrap-result-eyebrow">MODALIDAD AMRAP</span>

        <h2>Resultado AMRAP</h2>

        <p>
          Registra las rondas completas y las repeticiones adicionales
          realizadas durante el entrenamiento.
        </p>
      </header>

      <div className="amrap-result-grid">
        {/* RONDAS COMPLETAS */}

        <div className="amrap-result-field">
          <label htmlFor="amrap-rounds">Rondas completas</label>

          <input
            id="amrap-rounds"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="0"
            value={values.amrapRounds}
            onChange={(event) => onChange("amrapRounds", event.target.value)}
            required
          />
        </div>

        {/* REPETICIONES ADICIONALES */}

        <div className="amrap-result-field">
          <label htmlFor="amrap-extra-reps">Repeticiones adicionales</label>

          <input
            id="amrap-extra-reps"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="0"
            value={values.amrapExtraReps}
            onChange={(event) => onChange("amrapExtraReps", event.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}

export default AmrapResultFields;
