import * as z from "zod";

export const loginRequestSchema = z.object({
  username: z.string().min(1, "Introduce tu nombre de usuario"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

export const registerRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "El nombre de usuario es obligatorio")
    .max(50, "El nombre de usuario no puede superar 50 caracteres"),

  email: z
    .email("Introduce un correo electrónico válido")
    .trim()
    .max(254, "El correo electrónico no puede superar 254 caracteres"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede superar 72 caracteres"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
