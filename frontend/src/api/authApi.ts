import type { LoginRequest, RegisterRequest } from "./apiTypes";
import { apiRequest } from "./client/apiClient";
import { API_ENDPOINTS } from "./client/apiEndpoints";
import { API_ERROR_MESSAGES, handleApiError } from "./client/apiError";
import {
  loginRequestSchema,
  registerRequestSchema,
} from "../schemas/authSchemas";

export async function login(request: LoginRequest): Promise<string> {
  loginRequestSchema.parse(request);

  const response = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.AUTH.LOGIN);

  return response.text();
}

export async function register(request: RegisterRequest): Promise<string> {
  registerRequestSchema.parse(request);

  const response = await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  handleApiError(response, API_ERROR_MESSAGES.AUTH.REGISTER);

  return response.text();
}
