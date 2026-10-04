import type { WodAggregateResponse } from "../../types/Wod";
import type { WodsViewProps } from "./WodsView.Types";

function formatWodType(type: WodAggregateResponse["version"]["type"]) {
  return type === "FOR_TIME" ? "For Time" : type === "AMRAP" ? "AMRAP" : "EMOM";
}

function WodsView({
  wods,
  selectedWod,
  loading,
  error,
  onSelectWod,
  onBack,
}: WodsViewProps) {
  if (loading) {
    return <p className="ui-loading">Cargando WODs...</p>;
  }

  if (error) {
    return <p className="ui-error" role="alert">{error}</p>;
  }

  if (selectedWod) {
    return (
      <section className="page">
        <button className="button-tertiary back-button" onClick={onBack}>← Volver</button>

        <header className="page-header">
          <h1>{selectedWod.name}</h1>
          <p><span className="badge">{formatWodType(selectedWod.version.type)}</span></p>

        {selectedWod.version.timeCapSeconds && (
          <p className="metric-row"><span className="metric-value">{Math.floor(selectedWod.version.timeCapSeconds / 60)} min</span><span className="metric-label">Tiempo límite</span></p>
        )}

        {selectedWod.version.rounds && (
          <p className="resource-meta">Rondas: {selectedWod.version.rounds}</p>
        )}
        </header>

        <section className="detail-section">
          <h2>Entrenamiento</h2>

        <ol className="exercise-sequence">{selectedWod.composition.map((item) => (
          <li key={item.id}>
            <p>
              <strong>Ejercicio {item.exerciseId}</strong>
            </p>

            {item.reps !== null && <p>{item.reps} repeticiones</p>}

            {item.weightKg !== null && <p>{item.weightKg} kg</p>}

            {item.distanceM !== null && <p>{item.distanceM} m</p>}

            {item.durationSeconds !== null && (
              <p>{item.durationSeconds} segundos</p>
            )}
          </li>
        ))}</ol>
        </section>
      </section>
    );
  }

  return (
    <section className="page page--catalog">
      <header className="page-header">
        <p className="page-eyebrow">Catálogo</p>
        <h1>WODs</h1>
        <p>Elige un entrenamiento y consulta sus ejercicios.</p>
      </header>

      <div className="resource-list">{wods.map((wod) => (
        <article className="resource-row" key={wod.id}>
          <header><h2>{wod.name}</h2><span className="resource-meta">{formatWodType(wod.version.type)}</span></header>

          <p className="resource-meta">{wod.version.timeCapSeconds && `${Math.floor(wod.version.timeCapSeconds / 60)} min · `}{wod.composition.length} ejercicios</p>

          <button className="row-action" onClick={() => onSelectWod(wod.id)}>Abrir</button>
        </article>
      ))}</div>
    </section>
  );
}

export default WodsView;
