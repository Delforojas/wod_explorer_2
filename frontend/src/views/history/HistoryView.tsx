import { useEffect, useRef } from "react";

import type { HistoryViewProps } from "./HistoryView.Types";
import {
  formatExerciseResultDate,
  formatWodOrigin,
  formatWodType,
  getExerciseResultLines,
  getWodResultLines,
  isHistoryDateRangeInvalid,
} from "./historyPresentation";

function HistoryView({
  entries,
  mode,
  filters,
  appliedFilters,
  dateFiltersOpen,
  dateFiltersMounted,
  wodLoading,
  exerciseLoading,
  wodError,
  exerciseError,
  onFilterChange,
  onModeChange,
  onToggleDateFilters,
  onDateFiltersAnimationEnd,
  onApplyFilters,
  onClearFilters,
  onRetryWods,
  onRetryExercises,
}: HistoryViewProps) {
  const dateFilterFromRef = useRef<HTMLInputElement>(null);
  const dateFilterToggleRef = useRef<HTMLButtonElement>(null);
  const dateFiltersWasOpenRef = useRef(false);
  const loading = wodLoading && exerciseLoading && entries.length === 0;
  const hasSourceError = wodError !== null || exerciseError !== null;
  const hasCompleteFailure = wodError !== null && exerciseError !== null;
  const invalidDateRange = isHistoryDateRangeInvalid(filters);
  const hasActiveDateFilter = Boolean(appliedFilters.from || appliedFilters.to);
  const dateFilterChipLabel = appliedFilters.from && appliedFilters.to
    ? `${appliedFilters.from} - ${appliedFilters.to}`
    : appliedFilters.from
      ? `Desde ${appliedFilters.from}`
      : `Hasta ${appliedFilters.to}`;

  useEffect(() => {
    if (dateFiltersOpen) {
      dateFiltersWasOpenRef.current = true;
      dateFilterFromRef.current?.focus();
    } else if (dateFiltersWasOpenRef.current) {
      dateFilterToggleRef.current?.focus();
      dateFiltersWasOpenRef.current = false;
    }
  }, [dateFiltersOpen]);

  return (
    <section className="exercise-results-page history-page">
      <div className="exercise-results-container history-container">
        <header className="exercise-results-header">
          <p className="exercise-results-eyebrow">Registro personal</p>
          <h1>Historial</h1>
          <p className="exercise-results-description">
            Consulta tus intentos y filtra tu evolución por contexto.
          </p>
        </header>

        <div
          className="exercise-results-mode-toggle"
          role="group"
          aria-label="Tipo de actividad"
        >
          {(
            [
              ["ALL", "Todos"],
              ["WODS", "WODs"],
              ["EXERCISES", "Ejercicios"],
            ] as const
          ).map(([value, label]) => (
            <button
              className="exercise-results-mode-button"
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => onModeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="history-date-summary">
          <div className="history-date-summary-main">
            <div className="history-date-summary-label">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>
                {hasActiveDateFilter ? "Filtro de fechas activo" : "Todas las fechas"}
              </span>
            </div>
            {hasActiveDateFilter && (
              <span className="history-date-chip">
                <span>{dateFilterChipLabel}</span>
                <button
                  type="button"
                  className="history-date-chip-remove"
                  aria-label="Eliminar filtro de fechas"
                  onClick={onClearFilters}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M7 7l10 10M17 7L7 17" />
                  </svg>
                </button>
              </span>
            )}
          </div>
          <button
            className="history-date-toggle"
            type="button"
            aria-controls="history-date-filters"
            aria-expanded={dateFiltersOpen}
            ref={dateFilterToggleRef}
            onClick={onToggleDateFilters}
          >
            <svg
              className="history-date-filter-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 5h16M7 12h10M10 19h4" />
            </svg>
            <span>{dateFiltersOpen ? "Ocultar filtros" : "Filtrar por fecha"}</span>
            <svg
              className={dateFiltersOpen ? "history-date-chevron is-open" : "history-date-chevron"}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {dateFiltersMounted && (
          <form
            id="history-date-filters"
            className={`history-filters ${
              dateFiltersOpen
                ? "history-filters-open"
                : "history-filters-closing"
            }`}
            aria-hidden={!dateFiltersOpen}
            aria-label="Filtrar historial por fecha"
            onAnimationEnd={(event) => {
              if (event.animationName === "history-date-filters-out") {
                onDateFiltersAnimationEnd();
              }
            }}
            onSubmit={(event) => {
              event.preventDefault();
              if (!invalidDateRange) {
                onApplyFilters();
              }
            }}
          >
            <div className="history-filter-field">
              <label htmlFor="history-from">Desde</label>
              <input
                id="history-from"
                ref={dateFilterFromRef}
                type="date"
                tabIndex={dateFiltersOpen ? 0 : -1}
                value={filters.from}
                max={filters.to || undefined}
                aria-invalid={invalidDateRange}
                aria-describedby={
                  invalidDateRange ? "history-date-error" : undefined
                }
                onChange={(event) => onFilterChange("from", event.target.value)}
              />
            </div>

            <div className="history-filter-field">
              <label htmlFor="history-to">Hasta</label>
              <input
                id="history-to"
                type="date"
                tabIndex={dateFiltersOpen ? 0 : -1}
                value={filters.to}
                min={filters.from || undefined}
                aria-invalid={invalidDateRange}
                aria-describedby={
                  invalidDateRange ? "history-date-error" : undefined
                }
                onChange={(event) => onFilterChange("to", event.target.value)}
              />
            </div>

            {invalidDateRange && (
              <p
                id="history-date-error"
                className="history-filter-error"
                role="alert"
              >
                La fecha Desde no puede ser posterior a Hasta.
              </p>
            )}

            <div className="history-filter-actions">
              <button
                type="submit"
                className="history-filter-submit"
                disabled={invalidDateRange}
                tabIndex={dateFiltersOpen ? 0 : -1}
              >
                Aplicar
              </button>
              <button
                type="button"
                className="history-filter-clear"
                onClick={onClearFilters}
                tabIndex={dateFiltersOpen ? 0 : -1}
              >
                Limpiar
              </button>
            </div>
          </form>
        )}

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
          <p className="ui-loading" role="status">
            Cargando historial...
          </p>
        ) : hasCompleteFailure ? (
          <p className="ui-error" role="alert">
            No se pudo cargar ninguna actividad del historial. Reintenta cada
            fuente.
          </p>
        ) : entries.length === 0 ? (
          <p className="ui-empty">
            {hasSourceError
              ? "No hay datos disponibles para mostrar."
              : "Todavía no has registrado ningún resultado."}
          </p>
        ) : (
          <div className="history-list">
            {entries.map((entry) => (
              <article
                className="history-entry"
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
                        <span className="resource-meta">
                          {formatWodType(entry.result.type)}
                        </span>
                        <span className="resource-meta">
                          {formatWodOrigin(entry.result.origin)}
                        </span>
                      </div>
                    </header>
                    <p className="resource-meta">
                      {formatExerciseResultDate(entry.result.performedAt)}
                    </p>
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
                    <p className="resource-meta">
                      {formatExerciseResultDate(entry.result.performedAt)}
                    </p>
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
      </div>
    </section>
  );
}

export default HistoryView;
