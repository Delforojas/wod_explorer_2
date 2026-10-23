import * as z from "zod";

export const userRequestSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  createdAt: z.string(),
});

export const userUpdateRequestSchema = z.object({
  username: z.string(),
  email: z.string(),
});

export type UserRequest = z.infer<typeof userRequestSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserUpdateRequest = z.infer<typeof userUpdateRequestSchema>;
