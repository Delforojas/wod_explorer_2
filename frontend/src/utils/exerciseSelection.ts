import type { ExerciseResponse } from "../types/Exercise";

export const INVALID_EXERCISE_ID_MESSAGE =
  "El ejercicio seleccionado no es válido. Elige otro ejercicio.";

export const UNAVAILABLE_EXERCISE_MESSAGE =
  "No se encontró el ejercicio seleccionado. Elige otro ejercicio.";

export interface ExerciseSelectionResult {
  selectedExerciseId: number | undefined;
  error: string | null;
}

export function parseExerciseId(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function resolveExerciseSelection(
  exercises: ExerciseResponse[],
  value: string | null,
): ExerciseSelectionResult {
  if (value === null) {
    return { selectedExerciseId: undefined, error: null };
  }

  const selectedExerciseId = parseExerciseId(value);

  if (selectedExerciseId === undefined) {
    return {
      selectedExerciseId: undefined,
      error: INVALID_EXERCISE_ID_MESSAGE,
    };
  }

  const exerciseExists = exercises.some(
    (exercise) => exercise.id === selectedExerciseId,
  );

  if (!exerciseExists) {
    return {
      selectedExerciseId: undefined,
      error: UNAVAILABLE_EXERCISE_MESSAGE,
    };
  }

  return { selectedExerciseId, error: null };
}
