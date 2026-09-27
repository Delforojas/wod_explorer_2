export interface WodVersion {
  id: number;
  wodId: number;
  versionNumber: number;
  type: string;
  timeCapSeconds: number | null;
  rounds: number | null;
  createdAt: string;
}

export interface WodExercise {
  id: number;
  wodVersionId: number;
  exerciseId: number;
  position: number;
  reps: number | null;
  weightKg: number | null;
  distanceM: number | null;
  durationSeconds: number | null;
}

export interface Wod {
  id: number;
  ownerId: number | null;
  name: string;
  origin: string;
  createdAt: string;
  version: WodVersion;
  composition: WodExercise[];
}
