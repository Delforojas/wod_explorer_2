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

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} min`;
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

          <div className="wod-detail-prescription-summary">
            <p className="wod-detail-modality">
              {formatWodType(selectedWod.version.type)}
            </p>

            {(selectedWod.version.timeCapSeconds != null ||
              selectedWod.version.rounds != null) && (
              <div className="wod-detail-structure">
                {selectedWod.version.timeCapSeconds != null && (
                  <span>
                    {formatTime(selectedWod.version.timeCapSeconds)}
                    {selectedWod.version.type === "AMRAP"
                      ? " de trabajo"
                      : " límite"}
                  </span>
                )}

                {selectedWod.version.rounds != null && (
                  <span>{selectedWod.version.rounds} ciclos</span>
                )}
              </div>
            )}
          </div>
        </header>

        <section className="wod-detail-panel">
          <h2>Prescripción</h2>

          <ol className="wod-detail-sequence">
            {selectedWod.composition.map((item) => (
              <li key={item.id} className="wod-detail-exercise">
                <div className="wod-detail-exercise-prescription">
                  {item.reps != null && (
                    <span className="wod-detail-reps">{item.reps}</span>
                  )}

                  {item.reps == null && (
                    <span className="wod-detail-reps wod-detail-reps-empty" aria-hidden="true">
                      —
                    </span>
                  )}

                  {item.reps != null && (
                    <span className="wod-detail-reps-label">reps</span>
                  )}
                </div>

                <div className="wod-detail-exercise-content">
                  <h3 className="wod-detail-exercise-title">
                    {item.exerciseName}
                  </h3>

                  <div className="wod-detail-exercise-meta">
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
