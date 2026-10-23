import type { WodAggregateResponse } from "../../types/Wod";

export function normalizeWodSearch(search: string) {
  return search.trim().toLowerCase();
}

export function hasActiveWodFilters(search: string) {
  return normalizeWodSearch(search).length > 0;
}

export function filterWods(wods: WodAggregateResponse[], search: string) {
  const query = normalizeWodSearch(search);

  if (!query) {
    return wods;
  }

  return wods.filter((wod) => wod.name.toLowerCase().includes(query));
}
