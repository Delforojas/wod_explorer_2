export function getAuthenticatedUsername(): string | null {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    // Extraer el payload del JWT
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    // Convertir Base64URL a Base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Decodificar el contenido
    const decoded: unknown = JSON.parse(atob(base64));

    // Comprobar que contiene los datos necesarios
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("sub" in decoded) ||
      !("exp" in decoded) ||
      typeof decoded.sub !== "string" ||
      typeof decoded.exp !== "number"
    ) {
      return null;
    }

    // Comprobar que el token no ha caducado
    if (decoded.exp * 1000 <= Date.now()) {
      return null;
    }

    return decoded.sub;
  } catch {
    return null;
  }
}
