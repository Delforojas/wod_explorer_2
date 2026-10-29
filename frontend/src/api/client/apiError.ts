import { expireAuthSession } from "../../auth/authSession";

export const API_ERROR_MESSAGES = {
  AUTH: {
    LOGIN: "Error al iniciar sesión",
    REGISTER: "Error al registrar el usuario",
  },

  WODS: {
    GET_ALL: "Error al obtener los WODs",
    GET_BY_ID: "Error al obtener el WOD",
    GET_MY_WODS: "Error al obtener tus WODs",
    CREATE: "Error al crear el WOD",
    UPDATE: "Error al actualizar el WOD",
    DELETE: "Error al eliminar el WOD",
  },

  WOD_VERSIONS: {
    GET_ALL: "Error al obtener las versiones de los WODs",
    GET_BY_ID: "Error al obtener la versión del WOD",
  },

  WOD_VERSION_ITEMS: {
    GET_ALL: "Error al obtener los elementos de las versiones de los WODs",
    GET_BY_ID: "Error al obtener el elemento de la versión del WOD",
  },

  WOD_RESULTS: {
    GET_ALL: "Error al obtener los resultados de WOD",
    GET_PERSONAL_BESTS: "Error al obtener las mejores marcas",
    GET_BY_ID: "Error al obtener el resultado del WOD",
    CREATE: "Error al crear el resultado del WOD",
    DELETE: "Error al eliminar el resultado del WOD",
  },

  USERS: {
    GET_CURRENT: "Error al obtener el usuario actual",
    GET_BY_ID: "Error al obtener el usuario",
    UPDATE: "Error al actualizar el usuario",
    DELETE: "Error al eliminar el usuario",
  },

  EXERCISES: {
    GET_ALL: "Error al obtener los ejercicios",
    GET_BY_ID: "Error al obtener el ejercicio",
  },

  EXERCISE_RESULTS: {
    GET_ALL: "Error al obtener las marcas de ejercicios",
    CREATE: "Error al registrar la marca",
    DELETE: "Error al eliminar la marca",
  },
} as const;

interface ApiErrorOptions {
  clearSessionOnUnauthorized?: boolean;
  unauthorizedMessage?: string;
}

export function handleApiError(
  response: Response,
  message: string,
  options: ApiErrorOptions = {},
): void {
  if (!response.ok) {
    if (response.status === 401) {
      if (options.clearSessionOnUnauthorized !== false) {
        expireAuthSession();
      }

      throw new Error(
        options.unauthorizedMessage ??
          "Tu sesión ha expirado. Inicia sesión de nuevo.",
      );
    }

    if (response.status === 403) {
      throw new Error(
        "No tienes permisos para acceder a este recurso o el WOD ya no está disponible.",
      );
    }

    if (response.status === 404) {
      throw new Error("El WOD o resultado solicitado no existe.");
    }

    if (response.status === 400 || response.status === 422) {
      throw new Error("Los datos del resultado no son válidos.");
    }

    throw new Error(message);
  }
}
