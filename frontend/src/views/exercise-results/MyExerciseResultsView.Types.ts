import type { ExerciseResponse } from "../../types/Exercise";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import type { ExerciseResultsMode } from "./exerciseResultsMode";

export interface MyExerciseResultsViewProps {
  results: ExerciseResultResponse[];
  personalBests: ExerciseResultResponse[];
  exercises: ExerciseResponse[];
  mode: ExerciseResultsMode;
  resultsLoading: boolean;
  personalBestsLoading: boolean;
  resultsError: string | null;
  personalBestsError: string | null;
  exercisesError: string | null;
  onModeChange: (mode: ExerciseResultsMode) => void;
  onRetryResults: () => void;
  onRetryPersonalBests: () => void;
  onRetryExercises: () => void;
}
