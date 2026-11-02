import { Link } from "react-router-dom";

import type { WodAggregateResponse } from "../../types/Wod";

export interface WodDetailLayoutProps {
  selectedWod: WodAggregateResponse | null;
  onBack: () => void;
  eyebrow: string;
  description?: string;
  registrationHref?: string;
}

function formatWodType(type: WodAggregateResponse["version"]["type"]): string {
  return type === "FOR_TIME" ? "For Time" : type;
}

function WodDetail({
  selectedWod,
  onBack,
  eyebrow,
  description,
  registrationHref,
}: WodDetailLayoutProps) {
  if (!selectedWod) {
    return null;
  }

  return (
    <section className="wod-detail-page">
      <div className="wod-detail-container">
        <button className="wod-detail-back" type="button" onClick={onBack}>
          ← Volver
        </button>

        <header className="wod-detail-header">
          <p className="wod-detail-eyebrow">{eyebrow}</p>
          <h1>{selectedWod.name}</h1>

          {description && (
            <p className="wod-detail-description">{description}</p>
          )}

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

        <section className="wod-detail-panel">
          <h2>Entrenamiento</h2>

          <ol className="wod-detail-sequence">
            {selectedWod.composition.map((item, index) => (
              <li key={item.id} className="wod-detail-exercise">
                <span className="wod-detail-exercise-index" aria-hidden="true">
                  {index + 1}
                </span>

                <div className="wod-detail-exercise-content">
                  <h3 className="wod-detail-exercise-title">
                    {item.exerciseName}
                  </h3>

                  <div className="wod-detail-exercise-meta">
                    {item.reps != null && <span>{item.reps} repeticiones</span>}

                    {item.weightKg != null && <span>{item.weightKg} kg</span>}

                    {item.distanceM != null && <span>{item.distanceM} m</span>}

                    {item.durationSeconds != null && (
                      <span>{item.durationSeconds} segundos</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {registrationHref && (
          <Link to={registrationHref} className="wod-detail-register">
            Registrar resultado
          </Link>
        )}
      </div>
    </section>
  );
}

export default WodDetail;
