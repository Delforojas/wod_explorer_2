export const API_URL = "http://localhost:8080/api";

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

  WOD_RESULTS: {
    BASE: "/wod-results",
    BY_ID: (id: number) => `/wod-results/${id}`,
    PERSONAL_BESTS: "/wod-results/personal-bests",
  },
} as const;
