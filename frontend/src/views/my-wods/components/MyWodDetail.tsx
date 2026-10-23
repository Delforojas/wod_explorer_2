import type { MyWodsViewProps } from "../MyWodsView.Types";
import { Link } from "react-router-dom";

type MyWodDetailProps = Pick<MyWodsViewProps, "selectedWod" | "onBack">;

function MyWodDetail({ selectedWod, onBack }: MyWodDetailProps) {
  if (!selectedWod) {
    return null;
  }

  return (
    <section className="my-wod-detail-page">
      <div className="my-wod-detail-container">
        {/* BOTÓN VOLVER */}

        <button className="my-wod-detail-back" type="button" onClick={onBack}>
          ← Volver
        </button>

        {/* ENCABEZADO */}

        <header className="my-wod-detail-header">
          <p className="my-wod-detail-eyebrow">MI ENTRENAMIENTO</p>

          <h1>{selectedWod.name}</h1>

          <p className="my-wod-detail-description">
            Consulta la composición de tu entrenamiento.
          </p>

          {/* METADATOS */}

          <div className="my-wod-detail-meta">
            <span className="my-wod-detail-badge">
              {selectedWod.version.type}
            </span>

            {selectedWod.version.rounds != null && (
              <span className="my-wod-detail-badge">
                {selectedWod.version.rounds} rondas
              </span>
            )}

            {selectedWod.version.timeCapSeconds != null && (
              <span className="my-wod-detail-badge">
                {Math.floor(selectedWod.version.timeCapSeconds / 60)} min ·
                Tiempo límite
              </span>
            )}
          </div>
        </header>

        {/* COMPOSICIÓN */}

        <section className="my-wod-detail-panel">
          <h2>Entrenamiento</h2>

          <ol className="my-wod-detail-sequence">
            {selectedWod.composition.map((item) => (
              <li key={item.id} className="my-wod-detail-exercise">
                <h3 className="my-wod-detail-exercise-title">
                  {item.exerciseName}
                </h3>

                <div className="my-wod-detail-exercise-meta">
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

        {/* REGISTRAR RESULTADO */}

        <Link
          to={`/my-wod-results/new?wodId=${selectedWod.id}`}
          className="button-primary"
        >
          Registrar resultado
        </Link>
      </div>
    </section>
  );
}

export default MyWodDetail;
