import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import type { ExercisesViewProps } from "../ExercisesView.Types";
import {
  filterExercises,
  hasActiveExerciseFilters,
} from "../exerciseFilters";

type ExercisesListProps = Pick<ExercisesViewProps, "exercises">;

function ExercisesList({ exercises }: ExercisesListProps) {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const [search, setSearch] = useState("");
  const hasActiveFilters = hasActiveExerciseFilters(search);

  const filteredExercises = useMemo(
    () => filterExercises(exercises, search),
    [exercises, search],
  );

  return (
    <>
      {/* ENCABEZADO */}

      <header className="exercise-header">
        <h1>Ejercicios</h1>

        <p className="exercise-description">
          Explora los ejercicios disponibles en WOD Explorer y consulta sus
          características.
        </p>
      </header>

      {/* BUSCADOR */}

      <div className="exercise-search">
        <label htmlFor="exercise-search-input">
          Buscar ejercicios
        </label>

        <input
          id="exercise-search-input"
          type="search"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          autoComplete="off"
        />

        {hasActiveFilters && (
          <button
            type="button"
            className="exercise-clear-filters"
            onClick={() => setSearch("")}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* CONTADOR */}

      <p className="exercise-count">
        {hasActiveFilters
          ? `${filteredExercises.length} de ${exercises.length} ejercicios`
          : `${exercises.length} ejercicios disponibles`}
      </p>

      {/* LISTADO */}

      {filteredExercises.length === 0 ? (
        <p className="exercise-empty">
          {exercises.length === 0
            ? "No hay ejercicios disponibles."
            : "No se encontraron ejercicios con ese nombre."}
        </p>
      ) : (
        <div
          className={`exercise-grid ${
            !isAuthenticated ? "exercise-grid-guest" : ""
          }`}
        >
          {filteredExercises.map((exercise) => (
            <article
              key={exercise.id}
              className={`exercise-card ${
                !isAuthenticated ? "exercise-card-guest" : ""
              }`}
            >
              <div className="exercise-card-content">
                {/* TÍTULO */}

                <h2>
                  <span className="exercise-card-title">
                    {exercise.name}
                  </span>
                </h2>

                {/* CATEGORÍA Y MEDICIÓN */}

                <div className="exercise-card-meta">
                  <span>{exercise.category}</span>
                  <span>{exercise.measurementType}</span>
                </div>

                {/* ACCIÓN PARA USUARIOS AUTENTICADOS */}

                {isAuthenticated && (
                  <div className="exercise-card-actions">
                    <Link
                      to={`/exercise-results/new?exerciseId=${exercise.id}`}
                      className="exercise-card-action exercise-card-register"
                      aria-label={`Registrar resultado de ${exercise.name}`}
                    >
                      <span>Registrar resultado</span>

                      <span
                        className="exercise-card-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export default ExercisesList;
