import * as z from "zod";

export const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const registerRequestSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
