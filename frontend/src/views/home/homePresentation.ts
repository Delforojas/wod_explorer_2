import type { WodResultResponse } from "../../types/WodResult";
import type { WodAggregateResponse, WodCategory } from "../../types/Wod";

export const RECENT_ACTIVITY_LIMIT = 3;
export const FEATURED_WODS_LIMIT = 3;

const featuredCategoryOrder: WodCategory[] = ["CROSSTRAINING", "HYBRID"];

export function getHomeDisplayName(username: string | null): string {
  const normalizedUsername = username?.trim();

  return normalizedUsername || "atleta";
}

export function getRecentWodResults(
  results: WodResultResponse[],
): WodResultResponse[] {
  return results.slice(0, RECENT_ACTIVITY_LIMIT);
}

export function getFeaturedWods(
  wods: WodAggregateResponse[],
): WodAggregateResponse[] {
  const publicWods = wods.filter((wod) => wod.origin === "GENERIC");
  const picked = featuredCategoryOrder
    .map((category) => publicWods.find((wod) => wod.category === category))
    .filter((wod): wod is WodAggregateResponse => wod !== undefined);

  for (const wod of publicWods) {
    if (picked.length === FEATURED_WODS_LIMIT) {
      break;
    }

    if (!picked.some((featured) => featured.id === wod.id)) {
      picked.push(wod);
    }
  }

  return picked;
}

export function formatWodCategory(category: WodCategory | string | null | undefined): string {
  if (category === "HYBRID") {
    return "Hybrid";
  }

  if (category === "CROSSTRAINING") {
    return "Crosstraining";
  }

  return category?.replaceAll("_", " ") || "Sin categoría";
}

export function formatWodPrescription(wod: WodAggregateResponse): string {
  const { rounds, timeCapSeconds, type } = wod.version;

  if (rounds != null) {
    return `${rounds} rondas`;
  }

  if (timeCapSeconds != null) {
    return `${Math.floor(timeCapSeconds / 60)} min`;
  }

  return type === "FOR_TIME" ? "Por tiempo" : type;
}
