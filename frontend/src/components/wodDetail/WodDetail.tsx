import { useEffect, useRef, useState } from "react";
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

function formatVariant(variant: "MEN" | "WOMEN"): string {
  return variant === "MEN" ? "Hombres" : "Mujeres";
}

type WodItem = WodAggregateResponse["composition"][number];

function getPrimaryPrescription(item: WodItem): string | null {
  if (item.reps != null) {
    return String(item.reps);
  }
  if (item.distanceM != null) {
    return `${item.distanceM} m`;
  }
  if (item.calories != null) {
    return `${item.calories} cal`;
  }
  if (item.durationSeconds != null) {
    return `${item.durationSeconds} s`;
  }
  return null;
}

function WodDetail({
  selectedWod,
  onBack,
  eyebrow,
  description,
  registrationHref,
}: WodDetailLayoutProps) {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const feedbackTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current !== null) {
        window.clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  if (!selectedWod) {
    return null;
  }

  const wodName = selectedWod.name;

  function showCopyFeedback(message: string): void {
    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current);
    }

    setCopyFeedback(message);
    feedbackTimer.current = window.setTimeout(() => {
      setCopyFeedback(null);
      feedbackTimer.current = null;
    }, 3000);
  }

  async function handleCopyName(): Promise<void> {
    if (!navigator.clipboard?.writeText) {
      showCopyFeedback("No se pudo copiar el nombre.");
      return;
    }

    try {
      await navigator.clipboard.writeText(wodName);
      showCopyFeedback("Copiado");
    } catch {
      showCopyFeedback("No se pudo copiar el nombre.");
    }
  }

  return (
    <section className="wod-detail-page">
      <div className="wod-detail-container">
        <button className="wod-detail-back" type="button" onClick={onBack}>
          ← Volver
        </button>

        <header className="wod-detail-header">
          <p className="wod-detail-eyebrow">{eyebrow}</p>
          <div className="wod-detail-title-row">
            <h1>{wodName}</h1>
            <button
              className="wod-detail-copy"
              type="button"
              onClick={handleCopyName}
            >
              Copiar nombre
            </button>
          </div>

          {copyFeedback && (
            <p className="wod-detail-copy-feedback" role="status">
              {copyFeedback}
            </p>
          )}

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
            {selectedWod.composition.map((item) => {
              const primaryPrescription = getPrimaryPrescription(item);

              return (
                <li key={item.id} className="wod-detail-exercise">
                  <div className="wod-detail-exercise-prescription">
                    {primaryPrescription && (
                      <span className="wod-detail-primary">
                        {primaryPrescription}
                      </span>
                    )}
                  </div>

                  <div className="wod-detail-exercise-content">
                    <h3 className="wod-detail-exercise-title">
                      {item.exerciseName}
                    </h3>

                    <div className="wod-detail-exercise-meta">
                      {item.weightKg != null && <span>{item.weightKg} kg</span>}

                      {item.reps != null && primaryPrescription !== String(item.reps) && (
                        <span>{item.reps} reps</span>
                      )}

                      {item.distanceM != null && primaryPrescription !== `${item.distanceM} m` && (
                        <span>{item.distanceM} m</span>
                      )}

                      {item.calories != null && primaryPrescription !== `${item.calories} cal` && (
                        <span>{item.calories} cal</span>
                      )}

                      {item.durationSeconds != null && primaryPrescription !== `${item.durationSeconds} s` && (
                        <span>{item.durationSeconds} s</span>
                      )}

                      {item.prescriptions?.map((prescription) => (
                        <span key={prescription.variant}>
                          {formatVariant(prescription.variant)} {prescription.weightKg} kg
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {selectedWod.version.progressionRule && (
            <p className="wod-detail-rule">
              Progresión: {selectedWod.version.progressionRule.startReps}, {selectedWod.version.progressionRule.startReps + selectedWod.version.progressionRule.incrementReps}, {selectedWod.version.progressionRule.startReps + selectedWod.version.progressionRule.incrementReps * 2}... reps cada {selectedWod.version.progressionRule.everyRounds} {selectedWod.version.progressionRule.everyRounds === 1 ? "ronda" : "rondas"}
            </p>
          )}

          {selectedWod.version.timeExtension && (
            <p className="wod-detail-rule">
              {formatTime(selectedWod.version.timeExtension.initialSeconds)} iniciales + {formatTime(selectedWod.version.timeExtension.extensionSeconds)} cada {selectedWod.version.timeExtension.roundsPerExtension} {selectedWod.version.timeExtension.roundsPerExtension === 1 ? "ronda completada" : "rondas completadas"}
            </p>
          )}
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
