import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../auth/useAuth";

import type { WodsViewProps } from "../../views/wods/WodsView.Types";
import type { WodAggregateResponse } from "../../types/Wod";
import { filterWods, hasActiveWodFilters } from "../../views/wods/wodFilters";
import { getScrollBehavior, shouldShowScrollTop } from "../../views/wods/wodScroll";

type WodsListProps = Pick<WodsViewProps, "wods" | "onSelectWod">;

function formatWodType(type: WodAggregateResponse["version"]["type"]) {
  return type === "FOR_TIME" ? "For Time" : type === "AMRAP" ? "AMRAP" : "EMOM";
}

function WodsList({ wods, onSelectWod }: WodsListProps) {
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(() =>
    shouldShowScrollTop(window.scrollY),
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasActiveFilters = hasActiveWodFilters(search);

  const filteredWods = useMemo(() => filterWods(wods, search), [wods, search]);
  const hasFilteredResults = filteredWods.length > 0;
  const shouldShowSearchClear = hasActiveFilters && hasFilteredResults;
  const shouldShowEmptyClear =
    hasActiveFilters && wods.length > 0 && !hasFilteredResults;

  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(shouldShowScrollTop(window.scrollY));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleScrollToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: getScrollBehavior(prefersReducedMotion),
    });

    headingRef.current?.focus({ preventScroll: true });
  }

  return (
    <section className="wod-page">
      <div className="wod-container">
        {/* ENCABEZADO */}

        <header className="wod-header">
          <h1 ref={headingRef} tabIndex={-1}>
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
              className="wod-clear-filters"
              onClick={() => setSearch("")}
            >
              Limpiar filtros
            </button>
          )}
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
          <div className="wod-grid">
            {filteredWods.map((wod) => (
              <article className="wod-card" key={wod.id}>
                {/* NOMBRE */}

                <h2>{wod.name}</h2>

                {/* METADATOS */}

                <div className="wod-card-meta">
                  <span>{formatWodType(wod.version.type)}</span>

                  {wod.version.timeCapSeconds != null && (
                    <span>
                      {Math.floor(wod.version.timeCapSeconds / 60)} min
                    </span>
                  )}
                </div>

                {/* ACCIONES */}

                <div className="wod-card-actions">
                  {/* VER WOD */}

                  <button
                    className="wod-card-action"
                    type="button"
                    onClick={() => onSelectWod(wod.id)}
                    aria-label={`Abrir entrenamiento ${wod.name}`}
                  >
                    Ver →
                  </button>

                  {/* REGISTRAR RESULTADO */}

                  {isAuthenticated && (
                    <Link
                      to={`/my-wod-results/new?wodId=${wod.id}`}
                      className="wod-card-action wod-card-register"
                      aria-label={`Registrar resultado de ${wod.name}`}
                    >
                      Registrar resultado →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {showScrollTop && (
          <button
            type="button"
            className="wod-scroll-top"
            onClick={handleScrollToTop}
            aria-label="Volver arriba"
          >
            Volver arriba
          </button>
        )}
      </div>
    </section>
  );
}

export default WodsList;
