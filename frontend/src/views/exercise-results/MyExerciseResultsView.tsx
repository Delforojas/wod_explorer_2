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
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null,
  );
  const visibleResults = filterExerciseResults(results, selectedExerciseId);
  const selectedExercise = exercises.find(
    (exercise) => exercise.id === selectedExerciseId,
  );

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
          <label htmlFor="exercise-results-exercise-filter">Ejercicio</label>
          <select
            id="exercise-results-exercise-filter"
            value={selectedExerciseId ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedExerciseId(value === "" ? null : Number(value));
            }}
          >
            <option value="">Todos los ejercicios</option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
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
          <p className="exercise-results-empty">
            {selectedExercise
              ? `Todavía no has registrado marcas de ${selectedExercise.name}.`
              : "Todavía no has registrado ninguna marca."}
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
