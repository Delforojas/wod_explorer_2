import { describe, expect, it } from "vitest";

import type { WodAggregateResponse } from "../../types/Wod";
import {
  filterWods,
  hasActiveWodFilters,
  normalizeWodSearch,
} from "./wodFilters";

function createWod(id: number, name: string): WodAggregateResponse {
  return {
    id,
    ownerId: null,
    name,
    origin: "GENERIC",
    createdAt: "2026-01-01T00:00:00Z",
    version: {
      id,
      wodId: id,
      wodName: name,
      versionNumber: 1,
      type: "AMRAP",
      timeCapSeconds: null,
      rounds: null,
      createdAt: "2026-01-01T00:00:00Z",
    },
    composition: [],
  };
}

const wods = [createWod(1, "Fran"), createWod(2, "Helen")];

describe("wod filters", () => {
  it("normalizes whitespace and letter casing", () => {
    expect(normalizeWodSearch("  FRAN  ")).toBe("fran");
  });

  it("only reports a filter when the normalized search is non-empty", () => {
    expect(hasActiveWodFilters("   ")).toBe(false);
    expect(hasActiveWodFilters("fran")).toBe(true);
  });

  it("returns every WOD when the search is empty", () => {
    expect(filterWods(wods, "")).toEqual(wods);
    expect(filterWods(wods, "   ")).toEqual(wods);
  });

  it("filters WODs by name without case sensitivity", () => {
    expect(filterWods(wods, " HEL ")).toEqual([wods[1]]);
  });
});
