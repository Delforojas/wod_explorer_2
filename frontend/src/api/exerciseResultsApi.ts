import type { ExerciseResultRequest, ExerciseResultResponse } from "./apiTypes";
import { apiRequest, getAuthHeaders } from "./client/apiClient";
import { API_ENDPOINTS } from "./client/apiEndpoints";
import { API_ERROR_MESSAGES, handleApiError } from "./client/apiError";

export async function getExerciseResults(): Promise<ExerciseResultResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.EXERCISE_RESULTS.BASE, {
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.EXERCISE_RESULTS.GET_ALL);

  return response.json();
}

export async function createExerciseResult(
  request: ExerciseResultRequest,
): Promise<ExerciseResultResponse> {
  const response = await apiRequest(API_ENDPOINTS.EXERCISE_RESULTS.BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.EXERCISE_RESULTS.CREATE);

  return response.json();
}

export async function deleteExerciseResult(id: number): Promise<void> {
  const response = await apiRequest(API_ENDPOINTS.EXERCISE_RESULTS.BY_ID(id), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.EXERCISE_RESULTS.DELETE);
}
