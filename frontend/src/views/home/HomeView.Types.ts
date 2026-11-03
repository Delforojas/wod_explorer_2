import type { WodResultResponse } from "../../types/WodResult";
import type { WodAggregateResponse } from "../../types/Wod";

export type HomeActivityStatus = "idle" | "loading" | "success" | "error";
export type HomeFeaturedStatus = "loading" | "success" | "error";

export interface HomeViewProps {
  isAuthenticated: boolean;
  username: string | null;
  activityStatus: HomeActivityStatus;
  activityResults: WodResultResponse[];
  activityError: string | null;
  onRetry: () => void;
  featuredStatus: HomeFeaturedStatus;
  featuredWods: WodAggregateResponse[];
  featuredError: string | null;
  onRetryFeatured: () => void;
}
