export const AUTH_TOKEN_STORAGE_KEY = "token";

const AUTH_SESSION_EVENT = "wod-explorer:auth-session";

export type AuthSession = {
  token: string;
  username: string;
  expiresAt: number;
};

type JwtPayload = {
  sub?: unknown;
  exp?: unknown;
};

type AuthSessionReason = "signed-in" | "signed-out" | "expired";

function readStoredToken(): string | null {
  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function decodeSession(token: string): AuthSession | null {
  try {
    const encodedPayload = token.split(".")[1];

    if (!encodedPayload) {
      return null;
    }

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded: unknown = JSON.parse(atob(paddedBase64));

    if (typeof decoded !== "object" || decoded === null) {
      return null;
    }

    const payload = decoded as JwtPayload;

    if (
      typeof payload.sub !== "string" ||
      payload.sub.length === 0 ||
      typeof payload.exp !== "number" ||
      !Number.isFinite(payload.exp)
    ) {
      return null;
    }

    const expiresAt = payload.exp * 1000;

    if (expiresAt <= Date.now()) {
      return null;
    }

    return {
      token,
      username: payload.sub,
      expiresAt,
    };
  } catch {
    return null;
  }
}

function notify(reason: AuthSessionReason): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EVENT, {
      detail: { reason },
    }),
  );
}

export function readAuthSession(): AuthSession | null {
  const token = readStoredToken();

  return token ? decodeSession(token) : null;
}

export function hasStoredAuthToken(): boolean {
  return readStoredToken() !== null;
}

export function getValidAuthToken(): string | null {
  const token = readStoredToken();

  if (!token) {
    return null;
  }

  if (!decodeSession(token)) {
    clearAuthSession("expired");
    return null;
  }

  return token;
}

export function getAuthenticatedUsername(): string | null {
  return readAuthSession()?.username ?? null;
}

export function setAuthToken(token: string): AuthSession {
  const session = decodeSession(token);

  if (!session) {
    throw new Error("La sesión devuelta por la API no es válida.");
  }

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  notify("signed-in");

  return session;
}

export function clearAuthSession(reason: AuthSessionReason = "signed-out"): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  notify(reason);
}

export function expireAuthSession(): void {
  clearAuthSession("expired");
}

export function subscribeAuthSession(
  listener: (session: AuthSession | null) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => listener(readAuthSession());

  window.addEventListener(AUTH_SESSION_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(AUTH_SESSION_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}
