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

      <div className="resource-list glass-panel">{items.map((item) => (
        <article className="resource-row" key={item.id}>
          <h2>Item #{item.id}</h2>

          <p className="resource-meta">WOD: {getWodName(item.wodVersionId)}</p>
          <p className="resource-meta">Ejercicio: {item.exerciseName}</p>
          <p className="resource-meta">Posición: {item.position}</p>

          {item.reps !== null && <p className="resource-meta">Repeticiones: {item.reps}</p>}

          {item.weightKg !== null && <p className="resource-meta">Peso: {item.weightKg} kg</p>}

          {item.distanceM !== null && <p className="resource-meta">Distancia: {item.distanceM} m</p>}

          {item.durationSeconds !== null && (
            <p className="resource-meta">Duración: {item.durationSeconds} s</p>
          )}

          <button className="button-secondary" onClick={() => onSelectItem(item.id)}>Ver detalle</button>
        </article>
      ))}</div>

      {selectedItem && (
        <article className="surface detail-section glass-panel">
          <h2>Detalle del elemento</h2>

          <dl className="detail-data detail-data--stacked">
            <div><dt>Item</dt><dd>#{selectedItem.id}</dd></div>
            <div><dt>WOD</dt><dd>{getWodName(selectedItem.wodVersionId)}</dd></div>
            <div><dt>Ejercicio</dt><dd>{selectedItem.exerciseName}</dd></div>
            <div><dt>Posición</dt><dd>{selectedItem.position}</dd></div>
            {selectedItem.reps !== null && <div><dt>Repeticiones</dt><dd>{selectedItem.reps}</dd></div>}
            {selectedItem.weightKg !== null && <div><dt>Peso</dt><dd>{selectedItem.weightKg} kg</dd></div>}
            {selectedItem.distanceM !== null && <div><dt>Distancia</dt><dd>{selectedItem.distanceM} m</dd></div>}
            {selectedItem.durationSeconds !== null && <div><dt>Duración</dt><dd>{selectedItem.durationSeconds} s</dd></div>}
          </dl>
        </article>
      )}
    </section>
  );
}

export default WodVersionItemsView;
