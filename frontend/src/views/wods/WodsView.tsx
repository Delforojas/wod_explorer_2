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
    return <p>Cargando WODs...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (selectedWod) {
    return (
      <section>
        <button onClick={onBack}>← Volver</button>

        <h1>{selectedWod.name}</h1>

        <p>{formatWodType(selectedWod.version.type)}</p>

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

          <p>{formatWodType(wod.version.type)}</p>

          {wod.version.timeCapSeconds && (
            <p>{Math.floor(wod.version.timeCapSeconds / 60)} min</p>
          )}

          <p>{wod.composition.length} ejercicios</p>

          <button onClick={() => onSelectWod(wod.id)}>Ver WOD</button>
        </article>
      ))}
    </section>
  );
}

export default WodsView;
