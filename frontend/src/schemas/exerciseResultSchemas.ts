import * as z from "zod";

export const exerciseResultRequestSchema = z.object({
  exerciseId: z.number(),
  reps: z.number().optional(),
  weightKg: z.number().optional(),
  distanceM: z.number().optional(),
  durationSeconds: z.number().optional(),
  performedAt: z.string(),
});

export const exerciseResultResponseSchema = z.object({
  id: z.number(),
  exerciseId: z.number(),
  reps: z.number().nullable(),
  weightKg: z.number().nullable(),
  distanceM: z.number().nullable(),
  durationSeconds: z.number().nullable(),
  performedAt: z.string(),
  createdAt: z.string().nullable(),
});

export const exerciseResultResponseListSchema = z.array(
  exerciseResultResponseSchema,
);

export type ExerciseResultRequest = z.infer<typeof exerciseResultRequestSchema>;
export type ExerciseResultResponse = z.infer<
  typeof exerciseResultResponseSchema
>;
