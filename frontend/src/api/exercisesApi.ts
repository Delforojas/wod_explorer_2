import type { ExerciseResponse } from "./apiTypes";
import { apiRequest } from "./client/apiClient";
import { API_ENDPOINTS } from "./client/apiEndpoints";
import { API_ERROR_MESSAGES, handleApiError } from "./client/apiError";

export async function getExercises(): Promise<ExerciseResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.EXERCISES.BASE);

  handleApiError(response, API_ERROR_MESSAGES.EXERCISES.GET_ALL);

  return response.json();
}

export async function getExerciseById(id: number): Promise<ExerciseResponse> {
  const response = await apiRequest(API_ENDPOINTS.EXERCISES.BY_ID(id));

  handleApiError(response, API_ERROR_MESSAGES.EXERCISES.GET_BY_ID);

  return response.json();
}
