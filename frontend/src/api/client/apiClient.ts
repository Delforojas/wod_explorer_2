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
