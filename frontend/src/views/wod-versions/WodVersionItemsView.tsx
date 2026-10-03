import type { WodVersionItemResponse, WodVersionResponse } from "../../types/Wod";

interface WodVersionItemsViewProps {
  items: WodVersionItemResponse[];
  versions: WodVersionResponse[];
  selectedItem: WodVersionItemResponse | null;
  loading: boolean;
  error: string | null;
  onSelectItem: (id: number) => void;
}

function WodVersionItemsView({
  items,
  versions,
  selectedItem,
  loading,
  error,
  onSelectItem,
}: WodVersionItemsViewProps) {
  if (loading) {
    return <p>Cargando elementos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  function getWodName(wodVersionId: number) {
    return versions.find((version) => version.id === wodVersionId)?.wodName;
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

          <p>WOD: {getWodName(item.wodVersionId)}</p>
          <p>Ejercicio: {item.exerciseName}</p>
          <p>Posición: {item.position}</p>

          {item.reps !== null && <p>Repeticiones: {item.reps}</p>}

          {item.weightKg !== null && <p>Peso: {item.weightKg} kg</p>}

          {item.distanceM !== null && <p>Distancia: {item.distanceM} m</p>}

          {item.durationSeconds !== null && (
            <p>Duración: {item.durationSeconds} s</p>
          )}

          <button onClick={() => onSelectItem(item.id)}>Ver detalle</button>
        </article>
      ))}

      {selectedItem && (
        <article>
          <h2>Detalle del elemento</h2>

          <p>Item #{selectedItem.id}</p>

          <p>WOD: {getWodName(selectedItem.wodVersionId)}</p>

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

export default WodVersionItemsView;
