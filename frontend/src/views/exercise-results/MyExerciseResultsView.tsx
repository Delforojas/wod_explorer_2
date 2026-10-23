import { NavLink } from "react-router-dom";

import type { MyExerciseResultsViewProps } from "./MyExerciseResultsView.Types";

import ExerciseResultsList from "./components/ExerciseResultsList";

function MyExerciseResultsView({
  results,
  exercises,
  loading,
  error,
}: MyExerciseResultsViewProps) {
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
            to="/personal-bests"
            className={({ isActive }) =>
              isActive
                ? "exercise-results-nav-link exercise-results-nav-link-active"
                : "exercise-results-nav-link"
            }
          >
            Mejores marcas
          </NavLink>

          <NavLink
            to="/exercise-results/new"
            className="exercise-results-nav-link exercise-results-nav-action"
          >
            + Registrar marca
          </NavLink>
        </nav>

        {/* CONTENIDO */}

        {loading ? (
          <p className="exercise-results-loading" role="status">
            Cargando tus marcas...
          </p>
        ) : error ? (
          <p className="exercise-results-error" role="alert">
            {error}
          </p>
        ) : results.length === 0 ? (
          <p className="exercise-results-empty">
            Todavía no has registrado ninguna marca.
          </p>
        ) : (
          <ExerciseResultsList
            results={results}
            exercises={exercises}
          />
        )}
      </div>
    </section>
  );
}

export default MyExerciseResultsView;