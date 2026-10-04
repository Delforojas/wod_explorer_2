import type { UserResponse, UserUpdateRequest } from "./apiTypes";

import { apiRequest, getAuthHeaders, parseJson } from "./client/apiClient";

import { API_ENDPOINTS } from "./client/apiEndpoints";

import { API_ERROR_MESSAGES, handleApiError } from "./client/apiError";
import {
  userResponseSchema,
  userUpdateRequestSchema,
} from "../schemas/userSchemas";

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiRequest(API_ENDPOINTS.USERS.BASE, {
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.USERS.GET_CURRENT);

  return parseJson(response, userResponseSchema);
}

export async function getUserById(id: number): Promise<UserResponse> {
  const response = await apiRequest(API_ENDPOINTS.USERS.BY_ID(id), {
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.USERS.GET_BY_ID);

  return parseJson(response, userResponseSchema);
}

export async function updateUser(
  id: number,
  request: UserUpdateRequest,
): Promise<UserResponse> {
  userUpdateRequestSchema.parse(request);

  const response = await apiRequest(API_ENDPOINTS.USERS.BY_ID(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.USERS.UPDATE);

  return parseJson(response, userResponseSchema);
}

export async function deleteUser(id: number): Promise<void> {
  const response = await apiRequest(API_ENDPOINTS.USERS.BY_ID(id), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  handleApiError(response, API_ERROR_MESSAGES.USERS.DELETE);
}
