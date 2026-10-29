import type { WodsViewProps } from "../../views/wods/WodsView.Types";

type WodDetailProps = Pick<WodsViewProps, "selectedWod" | "onBack">;

function formatWodType(
  type: NonNullable<WodsViewProps["selectedWod"]>["version"]["type"],
) {
  return type === "FOR_TIME" ? "For Time" : type === "AMRAP" ? "AMRAP" : "EMOM";
}

function WodDetail({ selectedWod, onBack }: WodDetailProps) {
  if (!selectedWod) {
    return null;
  }

  return (
    <section className="wod-detail-page">
      <div className="wod-detail-container">
        {/* BOTÓN VOLVER */}

        <button className="wod-detail-back" type="button" onClick={onBack}>
          ← Volver
        </button>

        {/* ENCABEZADO */}

        <header className="wod-detail-header">
          <p className="wod-detail-eyebrow">ENTRENAMIENTO</p>

          <h1>{selectedWod.name}</h1>

          <p className="wod-detail-description">
            Consulta la composición de este entrenamiento.
          </p>

          {/* METADATOS DEL WOD */}

          <div className="wod-detail-meta">
            <span className="wod-detail-badge">
              {formatWodType(selectedWod.version.type)}
            </span>

            {selectedWod.version.rounds != null && (
              <span className="wod-detail-badge">
                {selectedWod.version.rounds} rondas
              </span>
            )}

            {selectedWod.version.timeCapSeconds != null && (
              <span className="wod-detail-badge">
                {Math.floor(selectedWod.version.timeCapSeconds / 60)} min ·
                Tiempo límite
              </span>
            )}
          </div>
        </header>

        {/* COMPOSICIÓN DEL WOD */}

        <section className="wod-detail-panel">
          <h2>Entrenamiento</h2>

          <ol className="wod-detail-sequence">
            {selectedWod.composition.map((item) => (
              <li key={item.id} className="wod-detail-exercise">
                {/* NOMBRE DEL EJERCICIO */}

                <h3 className="wod-detail-exercise-title">
                  {item.exerciseName}
                </h3>

                {/* PRESCRIPCIONES */}

                <div className="wod-detail-exercise-meta">
                  {item.reps != null && <span>{item.reps} repeticiones</span>}

                  {item.weightKg != null && <span>{item.weightKg} kg</span>}

                  {item.distanceM != null && <span>{item.distanceM} m</span>}

                  {item.durationSeconds != null && (
                    <span>{item.durationSeconds} segundos</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}

export default WodDetail;
