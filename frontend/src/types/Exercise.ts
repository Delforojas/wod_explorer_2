export type ExerciseCategory =
  | "WEIGHTLIFTING"
  | "GYMNASTICS"
  | "CARDIO"
  | "STRONGMAN"
  | "OTHER";

export type MeasurementType =
  | "WEIGHT"
  | "REPS"
  | "TIME"
  | "DISTANCE"
  | "WEIGHT_DISTANCE";

export interface ExerciseRequest {
  name: string;
  category: ExerciseCategory;
  measurementType: MeasurementType;
}

export interface ExerciseResponse {
  id: number;
  name: string;
  category: ExerciseCategory;
  measurementType: MeasurementType;
  active: boolean;
}
