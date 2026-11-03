import type { WodAggregateResponse, WodCategory } from "../../types/Wod";

export function normalizeWodSearch(search: string) {
  return search.trim().toLowerCase();
}

export function hasActiveWodFilters(search: string) {
  return normalizeWodSearch(search).length > 0;
}

export function isWodCategory(value: string | null): value is WodCategory {
  return value === "CROSSTRAINING" || value === "HYBRID";
}

export function filterWods(
  wods: WodAggregateResponse[],
  search: string,
  category?: WodCategory | null,
) {
  const query = normalizeWodSearch(search);

  return wods.filter(
    (wod) =>
      (!query || wod.name.toLowerCase().includes(query)) &&
      (!category || wod.category === category),
  );
}
