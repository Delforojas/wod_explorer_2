import type { WodOrigin, WodType } from "./Wod";

export interface WodResultRequest {
  wodVersionId: number;
  performedAt: string;

  completed?: boolean;

  timeSeconds?: number;

  progressRounds?: number;
  progressItemId?: number;
  progressReps?: number;
  progressDistanceM?: number;
  progressDurationSeconds?: number;

  amrapRounds?: number;
  amrapExtraReps?: number;
}

export interface WodResultResponse {
  id: number;

  wodId: number;
  wodName: string;
  origin: WodOrigin;

  wodVersionId: number;
  type: WodType;

  performedAt: string;

  completed: boolean | null;

  timeSeconds: number | null;

  progressRounds: number | null;
  progressItemId: number | null;
  progressReps: number | null;
  progressDistanceM: number | null;
  progressDurationSeconds: number | null;

  amrapRounds: number | null;
  amrapExtraReps: number | null;

  createdAt: string;
}
export interface WodResultFilters {
  wodId?: number;
  type?: WodType;
  origin?: WodOrigin;
  from?: string;
  to?: string;
}
