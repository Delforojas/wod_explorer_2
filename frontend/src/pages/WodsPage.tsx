import { useEffect, useState } from "react";
import type { WodAggregateResponse } from "../types/Wod";
import { getWods, getWodById } from "../api/wodsApi";

function WodsPage() {
  const [wods, setWods] = useState<WodAggregateResponse[]>([]);
  const [selectedWod, setSelectedWod] = useState<WodAggregateResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWods()
      .then((data) => {
        console.log("WODs recibidos:", data);
        setWods(data);
      })
      .catch(() => {
        setError("No se pudieron cargar los WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSelectWod(id: number) {
    try {
      setError(null);

      const wod = await getWodById(id);

      setSelectedWod(wod);
    } catch {
      setError("No se pudo cargar el WOD");
    }
  }

  function handleBack() {
    setSelectedWod(null);
  }

  if (loading) {
    return <p>Cargando WODs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (selectedWod) {
    return (
      <section>
        <button onClick={handleBack}>← Volver</button>

        <h1>{selectedWod.name}</h1>

        <p>
          {selectedWod.version.type === "FOR_TIME"
            ? "For Time"
            : selectedWod.version.type === "AMRAP"
              ? "AMRAP"
              : "EMOM"}
        </p>

        {selectedWod.version.timeCapSeconds && (
          <p>
            Tiempo límite: {Math.floor(selectedWod.version.timeCapSeconds / 60)}{" "}
            min
          </p>
        )}

        {selectedWod.version.rounds && (
          <p>Rondas: {selectedWod.version.rounds}</p>
        )}

        <h2>Entrenamiento</h2>

        {selectedWod.composition.map((item) => (
          <article key={item.id}>
            <p>
              <strong>Ejercicio {item.exerciseId}</strong>
            </p>

            {item.reps !== null && <p>{item.reps} repeticiones</p>}

            {item.weightKg !== null && <p>{item.weightKg} kg</p>}

            {item.distanceM !== null && <p>{item.distanceM} m</p>}

            {item.durationSeconds !== null && (
              <p>{item.durationSeconds} segundos</p>
            )}
          </article>
        ))}
      </section>
    );
  }

  return (
    <section>
      <header>
        <h1>WODs</h1>
        <p>Elige un entrenamiento y consulta sus ejercicios.</p>
      </header>

      {wods.map((wod) => (
        <article key={wod.id}>
          <h2>{wod.name}</h2>

          <p>
            {wod.version.type === "FOR_TIME"
              ? "For Time"
              : wod.version.type === "AMRAP"
                ? "AMRAP"
                : "EMOM"}
          </p>

          {wod.version.timeCapSeconds && (
            <p>{Math.floor(wod.version.timeCapSeconds / 60)} min</p>
          )}

          <p>{wod.composition.length} ejercicios</p>

          <button onClick={() => handleSelectWod(wod.id)}>Ver WOD</button>
        </article>
      ))}
    </section>
  );
}

export default WodsPage;
