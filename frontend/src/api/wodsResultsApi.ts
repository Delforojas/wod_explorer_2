// wodsResultsApi.ts
import type {
  WodResultRequest,
  WodResultResponse,
  WodResultFilters,
} from "./apiTypes";

import { apiRequest, getAuthHeaders, parseJson } from "./client/apiClient";

import { API_ENDPOINTS } from "./client/apiEndpoints";

import { API_ERROR_MESSAGES, handleApiError } from "./client/apiError";
import {
  wodResultFiltersSchema,
  wodResultRequestSchema,
  wodResultResponseListSchema,
  wodResultResponseSchema,
} from "../schemas/wodResultSchemas";

export async function getWodResults(
  filters: WodResultFilters = {},
): Promise<WodResultResponse[]> {
  wodResultFiltersSchema.parse(filters);

  const params = new URLSearchParams();

  if (filters.wodId !== undefined) {
    params.set("wodId", String(filters.wodId));
  }

  if (filters.type !== undefined) {
    params.set("type", filters.type);
  }

  if (filters.origin !== undefined) {
    params.set("origin", filters.origin);
  }

  if (filters.from !== undefined) {
    params.set("from", filters.from);
  }

  if (filters.to !== undefined) {
    params.set("to", filters.to);
  }

  const query = params.toString();

  const response = await apiRequest(
    `${API_ENDPOINTS.WOD_RESULTS.BASE}${query ? `?${query}` : ""}`,
    {
      headers: getAuthHeaders(),
    },
  );

  handleApiError(response, API_ERROR_MESSAGES.WOD_RESULTS.GET_ALL);

  return parseJson(response, wodResultResponseListSchema);
}

export async function getPersonalBests(): Promise<WodResultResponse[]> {
  const response = await apiRequest(API_ENDPOINTS.WOD_RESULTS.PERSONAL_BESTS, {
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.WOD_RESULTS.GET_PERSONAL_BESTS);

  return parseJson(response, wodResultResponseListSchema);
}

export async function getWodResultById(id: number): Promise<WodResultResponse> {
  const response = await apiRequest(API_ENDPOINTS.WOD_RESULTS.BY_ID(id), {
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.WOD_RESULTS.GET_BY_ID);

  return parseJson(response, wodResultResponseSchema);
}

export async function createWodResult(
  request: WodResultRequest,
): Promise<WodResultResponse> {
  wodResultRequestSchema.parse(request);

  const response = await apiRequest(API_ENDPOINTS.WOD_RESULTS.BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.WOD_RESULTS.CREATE);

  return parseJson(response, wodResultResponseSchema);
}

export async function deleteWodResult(id: number): Promise<void> {
  const response = await apiRequest(API_ENDPOINTS.WOD_RESULTS.BY_ID(id), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.WOD_RESULTS.DELETE);
}
