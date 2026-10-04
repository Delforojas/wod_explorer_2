import type {
  WodAggregateResponse,
  WodDefinitionRequest,
  WodVersionItemResponse,
  WodVersionResponse,
} from "./apiTypes";
import { apiRequest, getAuthHeaders, parseJson } from "./client/apiClient";
import { API_ENDPOINTS } from "./client/apiEndpoints";
import { API_ERROR_MESSAGES, handleApiError } from "./client/apiError";
import {
  wodDefinitionRequestSchema,
  wodAggregateResponseListSchema,
  wodAggregateResponseSchema,
  wodVersionItemResponseListSchema,
  wodVersionItemResponseSchema,
  wodVersionResponseListSchema,
  wodVersionResponseSchema,
} from "../schemas/wodSchemas";

export async function getWods(): Promise<WodAggregateResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BASE);

  handleApiError(response, API_ERROR_MESSAGES.WODS.GET_ALL);

  return parseJson(response, wodAggregateResponseListSchema);
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

  return parseJson(response, wodAggregateResponseSchema);
}

export async function getMyWods(): Promise<WodAggregateResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BASE, {
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.GET_MY_WODS);

  const wods = await parseJson(response, wodAggregateResponseListSchema);

  return wods.filter((wod) => wod.origin === "PERSONAL");
}

export async function createWod(
  request: WodDefinitionRequest,
): Promise<WodAggregateResponse> {
  wodDefinitionRequestSchema.parse(request);

  const response = await apiRequest(API_ENDPOINTS.WODS.BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.CREATE);

  return parseJson(response, wodAggregateResponseSchema);
}

export async function updateWod(
  id: number,
  request: WodDefinitionRequest,
): Promise<WodAggregateResponse> {
  wodDefinitionRequestSchema.parse(request);

  const response = await apiRequest(API_ENDPOINTS.WODS.BY_ID(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.UPDATE);

  return parseJson(response, wodAggregateResponseSchema);
}

export async function deleteWod(id: number): Promise<void> {
  const response = await apiRequest(API_ENDPOINTS.WODS.BY_ID(id), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.WODS.DELETE);
}

export async function getWodVersions(): Promise<WodVersionResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.WOD_VERSIONS.BASE);

  handleApiError(response, API_ERROR_MESSAGES.WOD_VERSIONS.GET_ALL);

  return parseJson(response, wodVersionResponseListSchema);
}

export async function getWodVersionById(
  id: number,
): Promise<WodVersionResponse> {
  const response = await apiRequest(API_ENDPOINTS.WOD_VERSIONS.BY_ID(id));

  handleApiError(response, API_ERROR_MESSAGES.WOD_VERSIONS.GET_BY_ID);

  return parseJson(response, wodVersionResponseSchema);
}

export async function getWodVersionItems(): Promise<WodVersionItemResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.WOD_VERSION_ITEMS.BASE);

  handleApiError(response, API_ERROR_MESSAGES.WOD_VERSION_ITEMS.GET_ALL);

  return parseJson(response, wodVersionItemResponseListSchema);
}

export async function getWodVersionItemById(
  id: number,
): Promise<WodVersionItemResponse> {
  const response = await apiRequest(API_ENDPOINTS.WOD_VERSION_ITEMS.BY_ID(id));

  handleApiError(response, API_ERROR_MESSAGES.WOD_VERSION_ITEMS.GET_BY_ID);

  return parseJson(response, wodVersionItemResponseSchema);
}
