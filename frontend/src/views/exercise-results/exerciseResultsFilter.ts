import type { ExerciseResultResponse } from "../../types/ExerciseResult";

export function filterExerciseResults(
  results: ExerciseResultResponse[],
  selectedExerciseId: number | null,
): ExerciseResultResponse[] {
  if (selectedExerciseId === null) {
    return results;
  }

  return results.filter((result) => result.exerciseId === selectedExerciseId);
}
