import type { ExerciseResponse } from "../../types/Exercise";

export interface ExercisesViewProps {
  exercises: ExerciseResponse[];
  selectedExercise: ExerciseResponse | null;
  loading: boolean;
  error: string | null;
  onSelectExercise: (id: number) => void;
}
