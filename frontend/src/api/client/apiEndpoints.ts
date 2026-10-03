const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error(
    "Falta configurar VITE_API_URL para conectar el frontend con la API.",
  );
}

let apiUrl: URL;

try {
  apiUrl = new URL(configuredApiUrl);
} catch {
  throw new Error("VITE_API_URL debe ser una URL absoluta válida.");
}

if (apiUrl.protocol !== "http:" && apiUrl.protocol !== "https:") {
  throw new Error("VITE_API_URL debe utilizar http o https.");
}

export const API_URL = configuredApiUrl.replace(/\/+$/, "");
export const GOOGLE_OAUTH_URL = new URL(
  "/oauth2/authorization/google",
  apiUrl.origin,
).toString();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  EXERCISES: {
    BASE: "/exercises",
    BY_ID: (id: number) => `/exercises/${id}`,
  },

  EXERCISE_RESULTS: {
    BASE: "/exercise-results",
    BY_ID: (id: number) => `/exercise-results/${id}`,
  },

  USERS: {
    BASE: "/users",
    BY_ID: (id: number) => `/users/${id}`,
  },

  WODS: {
    BASE: "/wods",
    BY_ID: (id: number) => `/wods/${id}`,
  },

  WOD_VERSIONS: {
    BASE: "/wod-versions",
    BY_ID: (id: number) => `/wod-versions/${id}`,
  },

  WOD_VERSION_ITEMS: {
    BASE: "/wod-version-items",
    BY_ID: (id: number) => `/wod-version-items/${id}`,
  },

  WOD_RESULTS: {
    BASE: "/wod-results",
    BY_ID: (id: number) => `/wod-results/${id}`,
    PERSONAL_BESTS: "/wod-results/personal-bests",
  },
} as const;
