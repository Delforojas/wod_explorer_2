import type { HistoryViewProps } from "./HistoryView.Types";
import {
  formatExerciseResultDate,
  formatWodOrigin,
  formatWodType,
  getExerciseResultLines,
  getWodResultLines,
} from "./historyPresentation";

function HistoryView({
  entries,
  wods,
  mode,
  filters,
  wodLoading,
  exerciseLoading,
  wodError,
  exerciseError,
  onFilterChange,
  onModeChange,
  onApplyFilters,
  onClearFilters,
  onRetryWods,
  onRetryExercises,
}: HistoryViewProps) {
  const loading = wodLoading && exerciseLoading && entries.length === 0;
  const hasSourceError = wodError !== null || exerciseError !== null;
  const hasCompleteFailure = wodError !== null && exerciseError !== null;

  return (
    <section className="page history-page">
      <header className="page-header">
        <p className="page-eyebrow">Registro personal</p>
        <h1>Historial</h1>
        <p>Consulta tus intentos y filtra tu evolución por contexto.</p>
      </header>

      <div className="history-modes" aria-label="Tipo de actividad">
        {(
          [
            ["ALL", "Todos"],
            ["WODS", "WODs"],
            ["EXERCISES", "Ejercicios"],
          ] as const
        ).map(([value, label]) => (
          <button
            className={mode === value ? "history-mode-active" : ""}
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => onModeChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="history-filters"
        onSubmit={(event) => {
          event.preventDefault();
          onApplyFilters();
        }}
      >
        {mode === "WODS" && (
          <>
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
          </>
        )}

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

      {wodError && (
        <div className="history-source-error" role="alert">
          <p>No se pudieron cargar los resultados de WOD.</p>
          <button type="button" onClick={onRetryWods}>
            Reintentar WODs
          </button>
        </div>
      )}

      {exerciseError && (
        <div className="history-source-error" role="alert">
          <p>No se pudieron cargar los resultados de ejercicios.</p>
          <button type="button" onClick={onRetryExercises}>
            Reintentar ejercicios
          </button>
        </div>
      )}

      {loading ? (
        <p className="ui-loading" role="status">Cargando historial...</p>
      ) : hasCompleteFailure ? (
        <p className="ui-error" role="alert">
          No se pudo cargar ninguna actividad del historial. Reintenta cada fuente.
        </p>
      ) : entries.length === 0 ? (
        <p className="ui-empty">
          {hasSourceError
            ? "No hay datos disponibles para mostrar."
            : "Todavía no has registrado ningún resultado."}
        </p>
      ) : (
        <div className="resource-list glass-panel">
          {entries.map((entry) => (
            <article
              className="resource-row resource-row-static history-entry"
              key={`${entry.kind}-${entry.result.id}`}
            >
              {entry.kind === "WOD" ? (
                <>
                  <header>
                    <div className="history-entry-heading">
                      <span className="history-entry-kind">WOD</span>
                      <h2>{entry.result.wodName}</h2>
                    </div>
                    <div className="history-result-badges">
                      <span className="resource-meta">{formatWodType(entry.result.type)}</span>
                      <span className="resource-meta">{formatWodOrigin(entry.result.origin)}</span>
                      <span className="resource-meta">
                        Versión ID {entry.result.wodVersionId}
                      </span>
                    </div>
                  </header>
                  <p className="resource-meta">{formatExerciseResultDate(entry.result.performedAt)}</p>
                  <div className="history-result-value">
                    {getWodResultLines(entry.result).map((line, index) => (
                      <p
                        className={index === 0 ? "result-value" : "resource-meta"}
                        key={`${line}-${index}`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <header>
                    <div className="history-entry-heading">
                      <span className="history-entry-kind">Ejercicio</span>
                      <h2>{entry.result.exerciseName}</h2>
                    </div>
                  </header>
                  <p className="resource-meta">{formatExerciseResultDate(entry.result.performedAt)}</p>
                  <div className="history-result-value">
                    {getExerciseResultLines(entry.result).map((line, index) => (
                      <p
                        className={index === 0 ? "result-value" : "resource-meta"}
                        key={`${line}-${index}`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistoryView;
