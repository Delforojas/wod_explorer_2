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

      <div className="resource-list">{versions.map((version) => (
        <article className="resource-row" key={version.id}>
          <header><h2>{version.wodName}</h2><span className="badge">{formatWodType(version.type)}</span></header>

          <p>Versión {version.versionNumber}</p>

          <p>Modalidad: {formatWodType(version.type)}</p>

          {version.timeCapSeconds !== null && (
            <p>Tiempo límite: {Math.floor(version.timeCapSeconds / 60)} min</p>
          )}

          {version.rounds !== null && <p>Rondas: {version.rounds}</p>}

          <p>Creada: {new Date(version.createdAt).toLocaleDateString()}</p>

          <button className="button-secondary" onClick={() => onSelectVersion(version.id)}>
            Ver detalle
          </button>
        </article>
      ))}</div>

      {selectedVersion && (
        <article className="surface detail-section">
          <h3>Ejercicios</h3>

          {selectedItems.length === 0 ? (
            <p>No hay ejercicios en esta versión.</p>
          ) : (
            [...selectedItems]
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                <div key={item.id}>
                  <h4>
                    {item.position}. {item.exerciseName}
                  </h4>

                  {item.reps !== null && <p>Repeticiones: {item.reps}</p>}

                  {item.weightKg !== null && <p>Peso: {item.weightKg} kg</p>}

                  {item.distanceM !== null && (
                    <p>Distancia: {item.distanceM} m</p>
                  )}

                  {item.durationSeconds !== null && (
                    <p>Duración: {item.durationSeconds} s</p>
                  )}
                </div>
              ))
          )}
        </article>
      )}
    </section>
  );
}

export default WodVersionsView;
