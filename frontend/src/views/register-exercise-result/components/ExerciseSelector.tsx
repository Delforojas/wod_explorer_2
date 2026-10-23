import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import type { ExerciseResponse } from "../../../types/Exercise";

interface ExerciseSelectorProps {
  exercises: ExerciseResponse[];
  selectedExerciseId: number | undefined;
  onExerciseChange: (value: string) => void;
}

function ExerciseSelector({
  exercises,
  selectedExerciseId,
  onExerciseChange,
}: ExerciseSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const inputId = useId();
  const listboxId = useId();

  const selectedExercise = exercises.find(
    (exercise) => exercise.id === selectedExerciseId,
  );

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  // CERRAR AL HACER CLIC FUERA

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // MANTENER VISIBLE LA OPCIÓN ACTIVA

  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    optionRefs.current.get(activeIndex)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  function selectExercise(exercise: ExerciseResponse) {
    onExerciseChange(String(exercise.id));

    setSearch("");
    setIsOpen(false);
    setActiveIndex(-1);

    inputRef.current?.focus();
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setIsOpen(true);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
        return;
      }

      setActiveIndex((previous) =>
        Math.min(previous + 1, filteredExercises.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setIsOpen(true);

      setActiveIndex((previous) => (previous <= 0 ? 0 : previous - 1));
    }

    if (
      event.key === "Enter" &&
      isOpen &&
      activeIndex >= 0 &&
      filteredExercises[activeIndex]
    ) {
      event.preventDefault();

      selectExercise(filteredExercises[activeIndex]);
    }
  }

  return (
    <div className="exercise-selector" ref={containerRef}>
      <label htmlFor={inputId} className="exercise-selector-label">
        Ejercicio
      </label>

      <div className="exercise-selector-control">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          className="exercise-selector-input"
          placeholder={
            selectedExercise ? selectedExercise.name : "Buscar ejercicio..."
          }
          value={search}
          autoComplete="off"
          onFocus={() => {
            setIsOpen(true);
          }}
          onChange={(event) => handleSearchChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <span className="exercise-selector-arrow" aria-hidden="true">
          {isOpen ? "⌃" : "⌄"}
        </span>
      </div>

      {selectedExercise && !isOpen && (
        <p className="exercise-selector-selected">
          Seleccionado: {selectedExercise.name}
        </p>
      )}

      {isOpen && (
        <ul
          id={listboxId}
          className="exercise-selector-list"
          role="listbox"
          aria-label="Ejercicios disponibles"
        >
          {filteredExercises.length === 0 ? (
            <li className="exercise-selector-empty">
              No se encontraron ejercicios
            </li>
          ) : (
            filteredExercises.map((exercise, index) => (
              <li
                key={exercise.id}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={selectedExerciseId === exercise.id}
                className={`exercise-selector-option ${
                  activeIndex === index ? "exercise-selector-option-active" : ""
                }`}
                ref={(element) => {
                  if (element) {
                    optionRefs.current.set(index, element);
                  } else {
                    optionRefs.current.delete(index);
                  }
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectExercise(exercise);
                }}
              >
                <span className="exercise-selector-option-name">
                  {exercise.name}
                </span>

                <span className="exercise-selector-option-category">
                  {exercise.category}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default ExerciseSelector;
