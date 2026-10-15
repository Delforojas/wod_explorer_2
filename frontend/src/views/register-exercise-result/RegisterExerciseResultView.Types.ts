import type { FormEvent } from "react";
import type { ExerciseResponse } from "../../types/Exercise";

export interface RegisterExerciseResultViewProps {
  exercises: ExerciseResponse[];

  selectedExerciseId: number | undefined;
  selectedExercise: ExerciseResponse | undefined;

  reps: number | undefined;
  weightKg: number | undefined;
  distanceM: number | undefined;
  durationSeconds: number | undefined;

  performedAt: string;

  loading: boolean;
  submitting: boolean;

  error: string | null;
  success: string | null;

  onExerciseChange: (value: string) => void;

  onRepsChange: (value: number | undefined) => void;
  onWeightChange: (value: number | undefined) => void;
  onDistanceChange: (value: number | undefined) => void;
  onDurationChange: (value: number | undefined) => void;

  onPerformedAtChange: (value: string) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
