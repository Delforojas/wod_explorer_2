import { beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_TOKEN_STORAGE_KEY,
  clearAuthSession,
  getAuthenticatedUsername,
  getValidAuthToken,
  readAuthSession,
  setAuthToken,
} from "./authSession";
import { getAuthErrorMessage } from "./authErrors";
import { loginRequestSchema, registerRequestSchema } from "../schemas/authSchemas";

const storage = new Map<string, string>();

function installStorage(): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  });
}

function createToken(expiresAt = Date.now() + 60_000): string {
  const payload = btoa(
    JSON.stringify({
      sub: "delfo",
      exp: Math.floor(expiresAt / 1000),
    }),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${payload}.signature`;
}

describe("auth session", () => {
  beforeEach(() => {
    storage.clear();
    installStorage();
  });

  it("stores a valid token and exposes the authenticated identity", () => {
    const token = createToken();

    setAuthToken(token);

    expect(storage.get(AUTH_TOKEN_STORAGE_KEY)).toBe(token);
    expect(getAuthenticatedUsername()).toBe("delfo");
    expect(readAuthSession()?.token).toBe(token);
  });

  it("rejects malformed and expired tokens", () => {
    expect(() => setAuthToken("invalid-token")).toThrow(
      "La sesión devuelta por la API no es válida.",
    );

    storage.set(AUTH_TOKEN_STORAGE_KEY, createToken(Date.now() - 1_000));

    expect(readAuthSession()).toBeNull();
    expect(getValidAuthToken()).toBeNull();
    expect(storage.has(AUTH_TOKEN_STORAGE_KEY)).toBe(false);
  });

  it("clears the token on logout", () => {
    setAuthToken(createToken());

    clearAuthSession();

    expect(readAuthSession()).toBeNull();
    expect(storage.has(AUTH_TOKEN_STORAGE_KEY)).toBe(false);
  });

  it("exposes validation and network failures as user-facing messages", () => {
    const invalidLogin = loginRequestSchema.safeParse({
      username: "",
      password: "",
    });
    const invalidRegister = registerRequestSchema.safeParse({
      username: "delfo",
      email: "not-an-email",
      password: "short",
    });

    expect(invalidLogin.success).toBe(false);
    expect(invalidRegister.success).toBe(false);
    expect(getAuthErrorMessage(new TypeError("Failed to fetch"), "fallback")).toBe(
      "No se pudo conectar con el servidor. Inténtalo de nuevo.",
    );
    expect(getAuthErrorMessage(new Error("Usuario o contraseña incorrectos."), "fallback")).toBe(
      "Usuario o contraseña incorrectos.",
    );
  });
});
