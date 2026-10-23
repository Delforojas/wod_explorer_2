import * as z from "zod";
import { wodOriginSchema, wodTypeSchema } from "./wodSchemas";

export const wodResultRequestSchema = z.object({
  wodVersionId: z.number(),
  performedAt: z.string(),
  completed: z.boolean().optional(),
  timeSeconds: z.number().optional(),
  progressRounds: z.number().optional(),
  progressItemId: z.number().optional(),
  progressReps: z.number().optional(),
  progressDistanceM: z.number().optional(),
  progressDurationSeconds: z.number().optional(),
  amrapRounds: z.number().optional(),
  amrapExtraReps: z.number().optional(),
});

export const wodResultResponseSchema = z.object({
  id: z.number(),
  wodId: z.number(),
  wodName: z.string(),
  origin: wodOriginSchema,
  wodVersionId: z.number(),
  type: wodTypeSchema,
  performedAt: z.string(),
  completed: z.boolean().nullable(),
  timeSeconds: z.number().nullable(),
  progressRounds: z.number().nullable(),
  progressItemId: z.number().nullable(),
  progressReps: z.number().nullable(),
  progressDistanceM: z.number().nullable(),
  progressDurationSeconds: z.number().nullable(),
  amrapRounds: z.number().nullable(),
  amrapExtraReps: z.number().nullable(),
  createdAt: z.string(),
});

export const wodResultFiltersSchema = z.object({
  wodId: z.number().optional(),
  type: wodTypeSchema.optional(),
  origin: wodOriginSchema.optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const wodResultResponseListSchema = z.array(wodResultResponseSchema);

export type WodResultRequest = z.infer<typeof wodResultRequestSchema>;
export type WodResultResponse = z.infer<typeof wodResultResponseSchema>;
export type WodResultFilters = z.infer<typeof wodResultFiltersSchema>;
