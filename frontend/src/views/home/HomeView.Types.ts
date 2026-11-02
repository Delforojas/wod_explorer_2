import type { WodResultResponse } from "../../types/WodResult";

export type HomeActivityStatus = "idle" | "loading" | "success" | "error";

export interface HomeViewProps {
  isAuthenticated: boolean;
  username: string | null;
  activityStatus: HomeActivityStatus;
  activityResults: WodResultResponse[];
  activityError: string | null;
  onRetry: () => void;
}
