import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";

import type { WodsViewProps } from "../../views/wods/WodsView.Types";
import type { WodAggregateResponse } from "../../types/Wod";
import {
  filterWods,
  getWodCategorySearchParams,
  hasActiveWodFilters,
  isWodCategory,
} from "../../views/wods/wodFilters";

type WodsListProps = Pick<WodsViewProps, "wods" | "onSelectWod">;

function formatWodType(type: WodAggregateResponse["version"]["type"]) {
  return type === "FOR_TIME" ? "For Time" : type === "AMRAP" ? "AMRAP" : "EMOM";
}

function getWodCategoryBadge(category: WodAggregateResponse["category"]) {
  if (category === "HYBRID") {
    return { label: "HYBRID", tone: "hybrid" };
  }

  if (category === "CROSSTRAINING") {
    return { label: "CROSSTRAINING", tone: "crosstraining" };
  }

  return {
    label: category?.replaceAll("_", " ") || "SIN CATEGORÍA",
    tone: "neutral",
  };
}

function WodsList({ wods, onSelectWod }: WodsListProps) {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const categoryParam = searchParams.get("category");
  const category = isWodCategory(categoryParam) ? categoryParam : null;
  const hasActiveFilters = hasActiveWodFilters(search) || category !== null;

  const filteredWods = useMemo(
    () => filterWods(wods, search, category),
    [category, search, wods],
  );
  const hasFilteredResults = filteredWods.length > 0;
  const shouldShowSearchClear = hasActiveFilters && hasFilteredResults;
  const shouldShowEmptyClear =
    hasActiveFilters && wods.length > 0 && !hasFilteredResults;

  function clearFilters() {
    setSearch("");
    setSearchParams(getWodCategorySearchParams(searchParams, null));
  }

  function selectCategory(nextCategory: typeof category) {
    setSearchParams(getWodCategorySearchParams(searchParams, nextCategory));
  }

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

          {category && (
            <p className="wod-category-context">
              Categoría: <strong>{category === "HYBRID" ? "Hybrid" : "Crosstraining"}</strong>
              <button type="button" onClick={clearFilters}>
                Ver todo
              </button>
            </p>
          )}
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

        <div
          className="exercise-results-mode-toggle"
          role="group"
          aria-label="Filtrar WODs por categoría"
        >
          {(
            [
              [null, "Todos"],
              ["CROSSTRAINING", "CROSSTRAINING"],
              ["HYBRID", "HYBRID"],
            ] as const
          ).map(([value, label]) => (
            <button
              className="exercise-results-mode-button"
              key={label}
              type="button"
              aria-pressed={category === value}
              onClick={() => selectCategory(value)}
            >
              {label}
            </button>
          ))}
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
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="my-wods-list wod-catalog-list">
            {filteredWods.map((wod) => {
              const categoryBadge = getWodCategoryBadge(wod.category);

              return (
                <article className="my-wod-row wod-catalog-row" key={wod.id}>
                  <div className="my-wod-content">
                    <h2>{wod.name}</h2>

                    <div className="my-wod-meta">
                      <span>{formatWodType(wod.version.type)}</span>

                      {wod.version.timeCapSeconds != null && (
                        <span>
                          {Math.floor(wod.version.timeCapSeconds / 60)} min
                        </span>
                      )}

                      <span
                        className={`wod-category-badge wod-category-badge--${categoryBadge.tone}`}
                      >
                        {categoryBadge.label}
                      </span>
                    </div>
                  </div>

                  <div
                    className="my-wods-actions catalog-row-actions"
                    role="group"
                    aria-label={`Acciones para ${wod.name}`}
                  >
                    <button
                      className="my-wods-action my-wods-view-action"
                      type="button"
                      onClick={() => onSelectWod(wod.id)}
                      aria-label={`Ver WOD ${wod.name}`}
                    >
                      Ver WOD
                    </button>

                    {isAuthenticated && (
                      <Link
                        to={`/my-wod-results/new?wodId=${wod.id}`}
                        className="my-wods-action catalog-register-action"
                        aria-label={`Registrar resultado de ${wod.name}`}
                      >
                        <span className="catalog-register-icon" aria-hidden="true">
                          +
                        </span>
                        <span>Registrar</span>
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

export default WodsList;
