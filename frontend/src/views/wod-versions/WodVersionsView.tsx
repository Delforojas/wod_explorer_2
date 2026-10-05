import type { WodVersionResponse } from "../../types/Wod";
import type { WodVersionsViewProps } from "./WodVersionsView.Types";

function formatWodType(type: WodVersionResponse["type"]) {
  return type === "FOR_TIME" ? "For Time" : type === "AMRAP" ? "AMRAP" : "EMOM";
}

function WodVersionsView({
  versions,
  selectedVersion,
  selectedItems,
  loading,
  error,
  onSelectVersion,
}: WodVersionsViewProps) {
  if (loading) {
    return <p className="ui-loading">Cargando versiones...</p>;
  }

  if (error) {
    return <p className="ui-error" role="alert">{error}</p>;
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Catálogo</p>
        <h1>Versiones de WODs</h1>
        <p>Consulta las diferentes versiones de los entrenamientos.</p>
      </header>

      {versions.length === 0 && <p className="ui-empty">No hay versiones disponibles.</p>}

      <div className="resource-list glass-panel">{versions.map((version) => (
        <article className="resource-row" key={version.id}>
          <header><h2>{version.wodName}</h2><span className="badge">{formatWodType(version.type)}</span></header>

          <p className="resource-meta">Versión {version.versionNumber}</p>

          <p className="resource-meta">Modalidad: {formatWodType(version.type)}</p>

          {version.timeCapSeconds !== null && (
            <p className="resource-meta">Tiempo límite: {Math.floor(version.timeCapSeconds / 60)} min</p>
          )}

          {version.rounds !== null && <p className="resource-meta">Rondas: {version.rounds}</p>}

          <p className="resource-meta">Creada: {new Date(version.createdAt).toLocaleDateString()}</p>

          <button className="button-secondary" onClick={() => onSelectVersion(version.id)}>
            Ver detalle
          </button>
        </article>
      ))}</div>

      {selectedVersion && (
        <article className="surface detail-section glass-panel">
          <h3>Ejercicios</h3>

          {selectedItems.length === 0 ? (
            <p>No hay ejercicios en esta versión.</p>
          ) : (
            <ol className="exercise-sequence">
              {[...selectedItems]
                .sort((a, b) => a.position - b.position)
                .map((item) => (
                  <li key={item.id}>
                    <h4>{item.position}. {item.exerciseName}</h4>
                    {item.reps !== null && <p className="resource-meta">Repeticiones: {item.reps}</p>}
                    {item.weightKg !== null && <p className="resource-meta">Peso: {item.weightKg} kg</p>}
                    {item.distanceM !== null && <p className="resource-meta">Distancia: {item.distanceM} m</p>}
                    {item.durationSeconds !== null && <p className="resource-meta">Duración: {item.durationSeconds} s</p>}
                  </li>
                ))}
            </ol>
          )}
        </article>
      )}
    </section>
  );
}

export default WodVersionsView;
