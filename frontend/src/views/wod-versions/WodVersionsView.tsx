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
    return <p>Cargando versiones...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <header>
        <h1>Versiones de WODs</h1>
        <p>Consulta las diferentes versiones de los entrenamientos.</p>
      </header>

      {versions.length === 0 && <p>No hay versiones disponibles.</p>}

      {versions.map((version) => (
        <article key={version.id}>
          <h2>{version.wodName}</h2>

          <p>Versión {version.versionNumber}</p>

          <p>Modalidad: {formatWodType(version.type)}</p>

          {version.timeCapSeconds !== null && (
            <p>Tiempo límite: {Math.floor(version.timeCapSeconds / 60)} min</p>
          )}

          {version.rounds !== null && <p>Rondas: {version.rounds}</p>}

          <p>Creada: {new Date(version.createdAt).toLocaleDateString()}</p>

          <button onClick={() => onSelectVersion(version.id)}>
            Ver detalle
          </button>
        </article>
      ))}

      {selectedVersion && (
        <article>
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
