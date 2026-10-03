export type WodOrigin = "GENERIC" | "PERSONAL";

export type WodType = "FOR_TIME" | "AMRAP" | "EMOM";

export interface WodRequest {
  name: string;
}

export interface WodResponse {
  id: number;
  ownerId: number | null;
  name: string;
  origin: WodOrigin;
  createdAt: string;
}

export interface WodCompositionItemRequest {
  exerciseId: number;
  reps?: number;
  weightKg?: number;
  distanceM?: number;
  durationSeconds?: number;
}

export interface WodDefinitionRequest {
  name: string;
  type: WodType;
  timeCapSeconds?: number;
  rounds?: number;
  items: WodCompositionItemRequest[];
}
export interface WodAggregateResponse {
  id: number;
  ownerId: number | null;
  name: string;
  origin: WodOrigin;
  createdAt: string;
  version: WodVersionResponse;
  composition: WodVersionItemResponse[];
}
export interface WodVersionRequest {
  wodId: number;
  type: WodType;
  timeCapSeconds?: number;
  rounds?: number;
}

export interface WodVersionItemRequest {
  wodVersionId: number;
  exerciseId: number;
  position: number;
  reps?: number;
  weightKg?: number;
  distanceM?: number;
  durationSeconds?: number;
}

export interface WodVersionResponse {
  id: number;
  wodId: number;
  wodName: string;
  versionNumber: number;
  type: WodType;
  timeCapSeconds: number | null;
  rounds: number | null;
  createdAt: string;
}

export interface WodVersionItemResponse {
  id: number;
  wodVersionId: number;
  exerciseId: number;
  exerciseName: string;
  position: number;
  reps: number | null;
  weightKg: number | null;
  distanceM: number | null;
  durationSeconds: number | null;
}
