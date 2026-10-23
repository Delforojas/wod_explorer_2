import type { ExerciseResponse } from "../../types/Exercise";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";

export interface MyExerciseResultsViewProps {
  results: ExerciseResultResponse[];
  exercises: ExerciseResponse[];
  loading: boolean;
  error: string | null;
}
