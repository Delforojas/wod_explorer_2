import type { WodResultResponse } from "../../types/WodResult";

export const RECENT_ACTIVITY_LIMIT = 3;

export function getHomeDisplayName(username: string | null): string {
  const normalizedUsername = username?.trim();

  return normalizedUsername || "atleta";
}

export function getRecentWodResults(
  results: WodResultResponse[],
): WodResultResponse[] {
  return results.slice(0, RECENT_ACTIVITY_LIMIT);
}
