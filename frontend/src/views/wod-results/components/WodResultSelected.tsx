import type { WodAggregateResponse } from "../../../types/Wod";

interface WodResultSelectedProps {
  wod: WodAggregateResponse;
}

function WodResultSelected({ wod }: WodResultSelectedProps) {
  return (
    <section
      className="wod-result-selected-card"
      aria-label="Información del WOD seleccionado"
    >
      {/* ENCABEZADO */}

      <header className="wod-result-selected-header">
        <div className="wod-result-selected-heading">
          <span className="wod-result-selected-eyebrow">
            ENTRENAMIENTO SELECCIONADO
          </span>

          <h2>{wod.name}</h2>
        </div>

        <span className="wod-result-selected-badge">{wod.version.type}</span>
      </header>

      {/* INFORMACIÓN */}

      <div className="wod-result-selected-info">
        <div className="wod-result-selected-meta">
          <span className="wod-result-selected-label">VERSIÓN</span>

          <span className="wod-result-selected-value">
            {wod.version.versionNumber}
          </span>
        </div>

        {wod.version.timeCapSeconds !== null && (
          <div className="wod-result-selected-meta">
            <span className="wod-result-selected-label">LÍMITE DE TIEMPO</span>

            <span className="wod-result-selected-value">
              {wod.version.timeCapSeconds} s
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export default WodResultSelected;
