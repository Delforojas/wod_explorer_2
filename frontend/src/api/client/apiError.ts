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

export function handleApiError(response: Response, message: string): void {
  if (!response.ok) {
    throw new Error(message);
  }
}
