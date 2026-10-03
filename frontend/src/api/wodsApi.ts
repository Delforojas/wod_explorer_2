import type { WodAggregateResponse, WodDefinitionRequest } from "./apiTypes";
import { apiRequest, getAuthHeaders } from "./client/apiClient";
import { API_ENDPOINTS } from "./client/apiEndpoints";
import { API_ERROR_MESSAGES, handleApiError } from "./client/apiError";

export async function getWods(): Promise<WodAggregateResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BASE);

  handleApiError(response, API_ERROR_MESSAGES.WODS.GET_ALL);

  return response.json();
}

export async function getWodById(id: number): Promise<WodAggregateResponse> {
  const token = localStorage.getItem("token");

  const response = await apiRequest(API_ENDPOINTS.WODS.BY_ID(id), {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.GET_BY_ID);

  return response.json();
}

export async function getMyWods(): Promise<WodAggregateResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BASE, {
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.GET_MY_WODS);

  const wods: WodAggregateResponse[] = await response.json();

  return wods.filter((wod) => wod.origin === "PERSONAL");
}

export async function createWod(
  request: WodDefinitionRequest,
): Promise<WodAggregateResponse> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.CREATE);

  return response.json();
}

export async function updateWod(
  id: number,
  request: WodDefinitionRequest,
): Promise<WodAggregateResponse> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BY_ID(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.UPDATE);

  return response.json();
}

export async function deleteWod(id: number): Promise<void> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BY_ID(id), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.DELETE);
}
