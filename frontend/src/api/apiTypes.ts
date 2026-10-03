// Authentication
export type { LoginRequest } from "../types/Login";
export type { RegisterRequest } from "../types/Register";

// User
export type { UserResponse, UserUpdateRequest } from "../types/User";

// Exercise
export type { ExerciseResponse } from "../types/Exercise";

// Exercise results
export type {
  ExerciseResultRequest,
  ExerciseResultResponse,
} from "../types/ExerciseResult";

// WOD
export type {
  WodAggregateResponse,
  WodDefinitionRequest,
  WodOrigin,
  WodType,
  WodVersionItemResponse,
  WodVersionResponse,
} from "../types/Wod";

// WOD results
export type {
  WodResultRequest,
  WodResultResponse,
  WodResultFilters,
} from "../types/WodResult";
