import { useEffect, useState } from "react";
import type { WodVersionResponse, WodVersionItemResponse } from "../types/Wod";
import {
  getWodVersions,
  getWodVersionById,
  getWodVersionItems,
} from "../api/wodsApi";

function WodVersionsPage() {
  const [versions, setVersions] = useState<WodVersionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVersion, setSelectedVersion] =
    useState<WodVersionResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<WodVersionItemResponse[]>(
    [],
  );
  useEffect(() => {
    getWodVersions()
      .then((data) => {
        setVersions(data);
      })
      .catch(() => {
        setError("No se pudieron cargar las versiones de los WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSelectVersion(id: number) {
    try {
      setError(null);

      const version = await getWodVersionById(id);
      const items = await getWodVersionItems();

      const versionItems = items.filter((item) => item.wodVersionId === id);

      setSelectedVersion(version);
      setSelectedItems(versionItems);
    } catch {
      setError("No se pudo cargar la versión");
    }
  }

  if (loading) {
    return <p>Cargando versiones...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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

          <p>
            Modalidad:{" "}
            {version.type === "FOR_TIME"
              ? "For Time"
              : version.type === "AMRAP"
                ? "AMRAP"
                : "EMOM"}
          </p>

          {version.timeCapSeconds !== null && (
            <p>Tiempo límite: {Math.floor(version.timeCapSeconds / 60)} min</p>
          )}

          {version.rounds !== null && <p>Rondas: {version.rounds}</p>}

          <p>Creada: {new Date(version.createdAt).toLocaleDateString()}</p>

          <button onClick={() => handleSelectVersion(version.id)}>
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

export default WodVersionsPage;
