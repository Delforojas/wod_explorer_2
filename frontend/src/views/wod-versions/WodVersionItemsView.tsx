import type { WodVersionItemsViewProps } from "./WodVersionItemsView.Types";

function WodVersionItemsView({
  items,
  versions,
  selectedItem,
  loading,
  error,
  onSelectItem,
}: WodVersionItemsViewProps) {
  if (loading) {
    return <p className="ui-loading">Cargando elementos...</p>;
  }

  if (error) {
    return <p className="ui-error" role="alert">{error}</p>;
  }

  function getWodName(wodVersionId: number) {
    return versions.find((version) => version.id === wodVersionId)?.wodName;
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Catálogo</p>
        <h1>Elementos de las versiones</h1>
        <p>Ejercicios que forman las distintas versiones de los WODs.</p>
      </header>

      {items.length === 0 && <p className="ui-empty">No hay elementos disponibles.</p>}

      <div className="resource-list">{items.map((item) => (
        <article className="resource-row" key={item.id}>
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
      ))}</div>

      {selectedItem && (
        <article className="surface detail-section">
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
