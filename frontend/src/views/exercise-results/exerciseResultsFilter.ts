import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import type { ExerciseResponse } from "../../types/Exercise";

export function filterExerciseResults(
  results: ExerciseResultResponse[],
  exercises: ExerciseResponse[],
  search: string,
): ExerciseResultResponse[] {
  const normalizedSearch = search.trim().toLowerCase();

  if (normalizedSearch.length === 0) {
    return results;
  }

  const matchingExerciseIds = new Set(
    exercises
      .filter((exercise) =>
        exercise.name.trim().toLowerCase().includes(normalizedSearch),
      )
      .map((exercise) => exercise.id),
  );

  return results.filter((result) => matchingExerciseIds.has(result.exerciseId));
}
