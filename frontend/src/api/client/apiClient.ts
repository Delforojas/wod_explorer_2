import * as z from "zod";
import { API_URL } from "./apiEndpoints";

export function getToken(): string {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Debes iniciar sesión");
  }

  return token;
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}
export async function apiRequest(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  return fetch(`${API_URL}${endpoint}`, options);
}

export async function parseJson<T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error("La API devolvió una respuesta no válida.");
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new Error("La API devolvió una respuesta inesperada.");
  }

  return result.data;
}
