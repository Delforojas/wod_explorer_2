export function getAuthErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof TypeError) {
    return "No se pudo conectar con el servidor. Inténtalo de nuevo.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
