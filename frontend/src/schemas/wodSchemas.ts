import * as z from "zod";

export const wodOriginSchema = z.enum(["GENERIC", "PERSONAL"]);
export const wodTypeSchema = z.enum(["FOR_TIME", "AMRAP", "EMOM"]);

export const wodRequestSchema = z.object({
  name: z.string(),
});

export const wodResponseSchema = z.object({
  id: z.number(),
  ownerId: z.number().nullable(),
  name: z.string(),
  origin: wodOriginSchema,
  createdAt: z.string(),
});

export const wodCompositionItemRequestSchema = z.object({
  exerciseId: z.number(),
  reps: z.number().optional(),
  weightKg: z.number().optional(),
  distanceM: z.number().optional(),
  durationSeconds: z.number().optional(),
});

export const wodDefinitionRequestSchema = z.object({
  name: z.string(),
  type: wodTypeSchema,
  timeCapSeconds: z.number().optional(),
  rounds: z.number().optional(),
  items: z.array(wodCompositionItemRequestSchema),
});

export const wodVersionRequestSchema = z.object({
  wodId: z.number(),
  type: wodTypeSchema,
  timeCapSeconds: z.number().optional(),
  rounds: z.number().optional(),
});

export const wodVersionItemRequestSchema = z.object({
  wodVersionId: z.number(),
  exerciseId: z.number(),
  position: z.number(),
  reps: z.number().optional(),
  weightKg: z.number().optional(),
  distanceM: z.number().optional(),
  durationSeconds: z.number().optional(),
});

export const wodVersionResponseSchema = z.object({
  id: z.number(),
  wodId: z.number(),
  wodName: z.string(),
  versionNumber: z.number(),
  type: wodTypeSchema,
  timeCapSeconds: z.number().nullable(),
  rounds: z.number().nullable(),
  createdAt: z.string(),
});

export const wodVersionItemResponseSchema = z.object({
  id: z.number(),
  wodVersionId: z.number(),
  exerciseId: z.number(),
  exerciseName: z.string(),
  position: z.number(),
  reps: z.number().nullable(),
  weightKg: z.number().nullable(),
  distanceM: z.number().nullable(),
  durationSeconds: z.number().nullable(),
});

export const wodAggregateResponseSchema = z.object({
  id: z.number(),
  ownerId: z.number().nullable(),
  name: z.string(),
  origin: wodOriginSchema,
  createdAt: z.string(),
  version: wodVersionResponseSchema,
  composition: z.array(wodVersionItemResponseSchema),
});

export const wodAggregateResponseListSchema = z.array(
  wodAggregateResponseSchema,
);
export const wodVersionResponseListSchema = z.array(wodVersionResponseSchema);
export const wodVersionItemResponseListSchema = z.array(
  wodVersionItemResponseSchema,
);

export type WodOrigin = z.infer<typeof wodOriginSchema>;
export type WodType = z.infer<typeof wodTypeSchema>;
export type WodRequest = z.infer<typeof wodRequestSchema>;
export type WodResponse = z.infer<typeof wodResponseSchema>;
export type WodCompositionItemRequest = z.infer<
  typeof wodCompositionItemRequestSchema
>;
export type WodDefinitionRequest = z.infer<typeof wodDefinitionRequestSchema>;
export type WodAggregateResponse = z.infer<
  typeof wodAggregateResponseSchema
>;
export type WodVersionRequest = z.infer<typeof wodVersionRequestSchema>;
export type WodVersionItemRequest = z.infer<
  typeof wodVersionItemRequestSchema
>;
export type WodVersionResponse = z.infer<typeof wodVersionResponseSchema>;
export type WodVersionItemResponse = z.infer<
  typeof wodVersionItemResponseSchema
>;
