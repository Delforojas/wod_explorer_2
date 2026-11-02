import { useState } from "react";
import { NavLink } from "react-router-dom";

import type { MyExerciseResultsViewProps } from "./MyExerciseResultsView.Types";

import ExerciseResultsList from "./components/ExerciseResultsList";
import { filterExerciseResults } from "./exerciseResultsFilter";

function MyExerciseResultsView({
  results,
  exercises,
  loading,
  error,
  onRetry,
}: MyExerciseResultsViewProps) {
  const [search, setSearch] = useState("");
  const visibleResults = filterExerciseResults(results, exercises, search);

  return (
    <section className="exercise-results-page">
      <div className="exercise-results-container">

        {/* ENCABEZADO */}

        <header className="exercise-results-header">
          <p className="exercise-results-eyebrow">
            Seguimiento personal
          </p>

          <h1>Marcas</h1>

          <p className="exercise-results-description">
            Registra tus resultados, consulta tus marcas y sigue tus progresos.
          </p>
        </header>

        {/* NAVEGACIÓN SECUNDARIA */}

        <nav
          className="exercise-results-navigation"
          aria-label="Secciones de marcas"
        >
          <NavLink
            to="/exercise-results/new"
            className="exercise-results-nav-link exercise-results-nav-action"
          >
            + Registrar marca
          </NavLink>
        </nav>

        <div className="exercise-results-filter">
          <label htmlFor="exercise-results-exercise-filter">
            Buscar por ejercicio
          </label>
          <div className="exercise-results-search-control">
            <span className="exercise-results-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
            </span>

            <input
              id="exercise-results-exercise-filter"
              type="search"
              placeholder="Buscar ejercicio..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoComplete="off"
            />

            {search.length > 0 && (
              <button
                type="button"
                className="exercise-results-search-clear"
                aria-label="Limpiar búsqueda de ejercicio"
                onClick={() => setSearch("")}
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="m7 7 10 10M17 7 7 17" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* CONTENIDO */}

        {loading ? (
          <p className="exercise-results-loading" role="status">
            Cargando tus marcas...
          </p>
        ) : error ? (
          <div className="exercise-results-state">
            <p className="exercise-results-error" role="alert">
              {error}
            </p>
            <button
              className="exercise-results-retry"
              type="button"
              onClick={onRetry}
            >
              Reintentar
            </button>
          </div>
        ) : visibleResults.length === 0 ? (
          <p className="exercise-results-empty" role="status" aria-live="polite">
            {results.length === 0
              ? "Todavía no has registrado ninguna marca."
              : `No se encontraron marcas para "${search.trim()}".`}
          </p>
        ) : (
          <ExerciseResultsList
            results={visibleResults}
            exercises={exercises}
          />
        )}
      </div>
    </section>
  );
}

export default MyExerciseResultsView;
