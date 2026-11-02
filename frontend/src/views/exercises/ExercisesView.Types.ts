import type { ExerciseResponse } from "../../types/Exercise";

export interface ExercisesViewProps {
  exercises: ExerciseResponse[];
  loading: boolean;
  error: string | null;
}
