import type { ExerciseResponse } from "../../types/Exercise";

export function normalizeExerciseSearch(search: string) {
  return search.trim().toLowerCase();
}

export function hasActiveExerciseFilters(search: string) {
  return normalizeExerciseSearch(search).length > 0;
}

export function filterExercises(
  exercises: ExerciseResponse[],
  search: string,
) {
  const query = normalizeExerciseSearch(search);

  if (!query) {
    return exercises;
  }

  return exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(query),
  );
}
