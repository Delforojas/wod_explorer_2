import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";

import type { ExercisesViewProps } from "../../views/exercises/ExercisesView.Types";

import {
  filterExercises,
  hasActiveExerciseFilters,
} from "../../views/exercises/exerciseFilters";

type ExercisesListProps = Pick<
  ExercisesViewProps,
  "exercises"
>;

function ExercisesList({ exercises }: ExercisesListProps) {
  const { isAuthenticated } = useAuth();

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
        <label htmlFor="exercise-search-input">Buscar ejercicios</label>

        <div className="catalog-search-control">
          <span className="catalog-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
          </span>

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
              className="catalog-search-clear"
              aria-label="Limpiar búsqueda de ejercicios"
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
        <ul
          className="resource-list catalog-list exercise-list"
          aria-label="Ejercicios disponibles"
        >
          {filteredExercises.map((exercise) => (
            <li
              key={exercise.id}
              className="resource-row editorial-row catalog-row exercise-row"
            >
              <header>
                <h2>
                  <span>{exercise.name}</span>
                </h2>
              </header>

              <div className="resource-meta">
                <span>{exercise.category}</span>
                <span>{exercise.measurementType}</span>
              </div>

              {isAuthenticated && (
                <div className="resource-actions exercise-row-action">
                  <Link
                    to={`/exercise-results/new?exerciseId=${exercise.id}`}
                    className="row-action exercise-register-action"
                    aria-label={`Registrar resultado de ${exercise.name}`}
                  >
                    Registrar resultado
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ExercisesList;
