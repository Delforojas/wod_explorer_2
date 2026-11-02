import type { ExerciseResultResponse } from "../../types/ExerciseResult";

export type ExerciseResultsMode = "all" | "best";

export function getResultsForMode(
  results: ExerciseResultResponse[],
  personalBests: ExerciseResultResponse[],
  mode: ExerciseResultsMode,
): ExerciseResultResponse[] {
  return mode === "best" ? personalBests : results;
}
