import * as z from "zod";

export const exerciseCategorySchema = z.enum([
  "WEIGHTLIFTING",
  "GYMNASTICS",
  "CARDIO",
  "STRONGMAN",
  "OTHER",
]);

export const measurementTypeSchema = z.enum([
  "WEIGHT",
  "REPS",
  "TIME",
  "DISTANCE",
  "WEIGHT_DISTANCE",
]);

export const exerciseRequestSchema = z.object({
  name: z.string(),
  category: exerciseCategorySchema,
  measurementType: measurementTypeSchema,
});

export const exerciseResponseSchema = exerciseRequestSchema.extend({
  id: z.number(),
  active: z.boolean(),
});

export const exerciseResponseListSchema = z.array(exerciseResponseSchema);

export type ExerciseCategory = z.infer<typeof exerciseCategorySchema>;
export type MeasurementType = z.infer<typeof measurementTypeSchema>;
export type ExerciseRequest = z.infer<typeof exerciseRequestSchema>;
export type ExerciseResponse = z.infer<typeof exerciseResponseSchema>;
