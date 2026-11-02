import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";

import type { WodsViewProps } from "../../views/wods/WodsView.Types";
import type { WodAggregateResponse } from "../../types/Wod";
import { filterWods, hasActiveWodFilters } from "../../views/wods/wodFilters";

type WodsListProps = Pick<WodsViewProps, "wods" | "onSelectWod">;

function formatWodType(type: WodAggregateResponse["version"]["type"]) {
  return type === "FOR_TIME" ? "For Time" : type === "AMRAP" ? "AMRAP" : "EMOM";
}

function WodsList({ wods, onSelectWod }: WodsListProps) {
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const hasActiveFilters = hasActiveWodFilters(search);

  const filteredWods = useMemo(() => filterWods(wods, search), [wods, search]);
  const hasFilteredResults = filteredWods.length > 0;
  const shouldShowSearchClear = hasActiveFilters && hasFilteredResults;
  const shouldShowEmptyClear =
    hasActiveFilters && wods.length > 0 && !hasFilteredResults;

  return (
    <section className="wod-page">
      <div className="wod-container">
        {/* ENCABEZADO */}

        <header className="wod-header">
          <h1>
            WODs
          </h1>

          <p className="wod-description">
            Explora distintos entrenamientos y encuentra el que te apetezca
            hacer hoy.
          </p>
        </header>

        {/* BUSCADOR */}

        <div className="wod-search">
          <label htmlFor="wod-search-input">Buscar WODs</label>

          <div className="catalog-search-control">
            <span className="catalog-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
            </span>

            <input
              id="wod-search-input"
              type="search"
              placeholder="Buscar WOD..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoComplete="off"
            />

            {shouldShowSearchClear && (
              <button
                type="button"
                className="catalog-search-clear"
                aria-label="Limpiar búsqueda de WODs"
                onClick={() => setSearch("")}
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="m7 7 10 10M17 7 7 17" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* CONTADOR */}

        <p className="wod-count">
          {hasActiveFilters
            ? `${filteredWods.length} de ${wods.length} entrenamientos`
            : `${wods.length} entrenamientos disponibles`}
        </p>

        {/* LISTADO */}

        {filteredWods.length === 0 ? (
          <div className="wod-empty-state" role="status" aria-live="polite">
            <span className="wod-empty-state-icon" aria-hidden="true">
              ?
            </span>

            <h2>
              {wods.length === 0
                ? "No hay entrenamientos disponibles"
                : "No se encontraron WODs"}
            </h2>

            <p>
              {wods.length === 0
                ? "Ahora mismo no hay WODs disponibles en el catálogo."
                : "No hay entrenamientos que coincidan con los criterios seleccionados."}
            </p>

            {shouldShowEmptyClear && (
              <button
                type="button"
                className="wod-clear-filters"
                onClick={() => setSearch("")}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <ul
            className="resource-list catalog-list wod-list"
            aria-label="WODs disponibles"
          >
            {filteredWods.map((wod) => (
              <li
                className="resource-row editorial-row catalog-row wod-row"
                key={wod.id}
              >
                <header>
                  <h2>{wod.name}</h2>
                </header>

                <div className="resource-meta">
                  <span>{formatWodType(wod.version.type)}</span>

                  {wod.version.timeCapSeconds != null && (
                    <span>
                      {Math.floor(wod.version.timeCapSeconds / 60)} min
                    </span>
                  )}
                </div>

                <div className="resource-actions wod-row-actions">
                  <button
                    className="row-action wod-view-action"
                    type="button"
                    onClick={() => onSelectWod(wod.id)}
                    aria-label={`Abrir entrenamiento ${wod.name}`}
                  >
                    Ver WOD
                    <span aria-hidden="true">→</span>
                  </button>

                  {isAuthenticated && (
                    <Link
                      to={`/my-wod-results/new?wodId=${wod.id}`}
                      className="row-action wod-register-action"
                      aria-label={`Registrar resultado de ${wod.name}`}
                    >
                      Registrar resultado
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </section>
  );
}

export default WodsList;
