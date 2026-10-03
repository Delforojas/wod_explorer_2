import { useEffect, useState } from "react";
import type { WodVersionItemResponse, WodVersionResponse } from "../types/Wod";
import {
  getWodVersionItems,
  getWodVersionItemById,
  getWodVersions,
} from "../api/wodsApi";

function WodVersionItemsPage() {
  const [items, setItems] = useState<WodVersionItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<WodVersionResponse[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<WodVersionItemResponse | null>(null);

  useEffect(() => {
    Promise.all([getWodVersionItems(), getWodVersions()])
      .then(([itemsData, versionsData]) => {
        setItems(itemsData);
        setVersions(versionsData);
      })
      .catch(() => {
        setError("No se pudieron cargar los elementos de los WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSelectItem(id: number) {
    try {
      setError(null);

      const item = await getWodVersionItemById(id);

      setSelectedItem(item);
    } catch {
      setError("No se pudo cargar el elemento");
    }
  }

  if (loading) {
    return <p>Cargando elementos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <header>
        <h1>Elementos de las versiones</h1>
        <p>Ejercicios que forman las distintas versiones de los WODs.</p>
      </header>

      {items.length === 0 && <p>No hay elementos disponibles.</p>}

      {items.map((item) => (
        <article key={item.id}>
          <h2>Item #{item.id}</h2>

          <p>
            WOD:{" "}
            {
              versions.find((version) => version.id === item.wodVersionId)
                ?.wodName
            }
          </p>
          <p>Ejercicio: {item.exerciseName}</p>
          <p>Posición: {item.position}</p>

          {item.reps !== null && <p>Repeticiones: {item.reps}</p>}

          {item.weightKg !== null && <p>Peso: {item.weightKg} kg</p>}

          {item.distanceM !== null && <p>Distancia: {item.distanceM} m</p>}

          {item.durationSeconds !== null && (
            <p>Duración: {item.durationSeconds} s</p>
          )}

          <button onClick={() => handleSelectItem(item.id)}>Ver detalle</button>
        </article>
      ))}

      {selectedItem && (
        <article>
          <h2>Detalle del elemento</h2>

          <p>Item #{selectedItem.id}</p>

          <p>
            WOD:{" "}
            {
              versions.find(
                (version) => version.id === selectedItem.wodVersionId,
              )?.wodName
            }
          </p>

          <p>Ejercicio: {selectedItem.exerciseName}</p>
          <p>Posición: {selectedItem.position}</p>

          {selectedItem.reps !== null && (
            <p>Repeticiones: {selectedItem.reps}</p>
          )}

          {selectedItem.weightKg !== null && (
            <p>Peso: {selectedItem.weightKg} kg</p>
          )}

          {selectedItem.distanceM !== null && (
            <p>Distancia: {selectedItem.distanceM} m</p>
          )}

          {selectedItem.durationSeconds !== null && (
            <p>Duración: {selectedItem.durationSeconds} s</p>
          )}
        </article>
      )}
    </section>
  );
}

export default WodVersionItemsPage;
