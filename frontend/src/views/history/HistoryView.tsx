import type { HistoryViewProps } from "./HistoryView.Types";
import {
  formatWodOrigin,
  formatWodResultDate,
  formatWodType,
  getWodResultLines,
} from "../wod-results/resultPresentation";

function HistoryView({
  results,
  wods,
  filters,
  loading,
  error,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: HistoryViewProps) {
  if (loading) {
    return (
      <section className="page placeholder-page">
        <header className="page-header"><p className="page-eyebrow">Registro personal</p><h1>Historial</h1></header>
        <p className="ui-loading">Cargando historial...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page placeholder-page">
        <header className="page-header"><p className="page-eyebrow">Registro personal</p><h1>Historial</h1></header>
        <p className="ui-error" role="alert">{error}</p>
      </section>
    );
  }

  return (
    <section className="page history-page">
      <header className="page-header">
        <p className="page-eyebrow">Registro personal</p>
        <h1>Historial</h1>
        <p>Consulta tus intentos y filtra tu evolución por contexto.</p>
      </header>

      <form
        className="history-filters"
        onSubmit={(event) => {
          event.preventDefault();
          onApplyFilters();
        }}
      >
        <div className="history-filter-field">
          <label htmlFor="history-wod">WOD</label>
          <select
            id="history-wod"
            value={filters.wodId}
            onChange={(event) => onFilterChange("wodId", event.target.value)}
          >
            <option value="">Todos los WODs</option>
            {wods.map((wod) => (
              <option key={wod.id} value={wod.id}>
                {wod.name}
              </option>
            ))}
          </select>
        </div>

        <div className="history-filter-field">
          <label htmlFor="history-type">Modalidad</label>
          <select
            id="history-type"
            value={filters.type}
            onChange={(event) => onFilterChange("type", event.target.value)}
          >
            <option value="">Todas</option>
            <option value="FOR_TIME">FOR TIME</option>
            <option value="AMRAP">AMRAP</option>
            <option value="EMOM">EMOM</option>
          </select>
        </div>

        <div className="history-filter-field">
          <label htmlFor="history-origin">Origen</label>
          <select
            id="history-origin"
            value={filters.origin}
            onChange={(event) => onFilterChange("origin", event.target.value)}
          >
            <option value="">Todos</option>
            <option value="GENERIC">Genéricos</option>
            <option value="PERSONAL">Personales</option>
          </select>
        </div>

        <div className="history-filter-field">
          <label htmlFor="history-from">Desde</label>
          <input
            id="history-from"
            type="date"
            value={filters.from}
            onChange={(event) => onFilterChange("from", event.target.value)}
          />
        </div>

        <div className="history-filter-field">
          <label htmlFor="history-to">Hasta</label>
          <input
            id="history-to"
            type="date"
            value={filters.to}
            onChange={(event) => onFilterChange("to", event.target.value)}
          />
        </div>

        <div className="history-filter-actions">
          <button type="submit" className="history-filter-submit">
            Aplicar filtros
          </button>
          <button
            type="button"
            className="history-filter-clear"
            onClick={onClearFilters}
          >
            Limpiar
          </button>
        </div>
      </form>

      {results.length === 0 ? (
        <p className="ui-empty">Todavía no has registrado ningún resultado.</p>
      ) : (
        <div className="resource-list glass-panel">{results.map((result) => (
          <article className="resource-row resource-row-static" key={result.id}>
            <header>
              <h2>{result.wodName}</h2>
              <div className="history-result-badges">
                <span className="resource-meta">{formatWodType(result.type)}</span>
                <span className="resource-meta">{formatWodOrigin(result.origin)}</span>
                <span className="resource-meta">Versión ID {result.wodVersionId}</span>
              </div>
            </header>
            <p className="resource-meta">{formatWodResultDate(result.performedAt)}</p>
            <div className="history-result-value">
              {getWodResultLines(result).map((line, index) => (
                <p
                  className={index === 0 ? "result-value" : "resource-meta"}
                  key={`${line}-${index}`}
                >
                  {line}
                </p>
              ))}
            </div>
          </article>
        ))}</div>
      )}
    </section>
  );
}

export default HistoryView;
