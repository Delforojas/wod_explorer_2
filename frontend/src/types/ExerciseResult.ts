export interface ExerciseResultRequest {
  exerciseId: number;
  reps?: number;
  weightKg?: number;
  distanceM?: number;
  durationSeconds?: number;
  performedAt: string;
}

export interface ExerciseResultResponse {
  id: number;
  exerciseId: number;
  reps: number | null;
  weightKg: number | null;
  distanceM: number | null;
  durationSeconds: number | null;
  performedAt: string;
  createdAt: string | null;
}
