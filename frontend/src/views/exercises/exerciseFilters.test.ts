import { describe, expect, it } from "vitest";

import type { ExerciseResponse } from "../../types/Exercise";
import {
  filterExercises,
  hasActiveExerciseFilters,
  normalizeExerciseSearch,
} from "./exerciseFilters";

const exercises: ExerciseResponse[] = [
  {
    id: 1,
    name: "Sentadilla",
    category: "GYMNASTICS",
    measurementType: "REPS",
    active: true,
  },
  {
    id: 2,
    name: "Press de banca",
    category: "WEIGHTLIFTING",
    measurementType: "REPS",
    active: true,
  },
];

describe("exercise filters", () => {
  it("normalizes whitespace and letter casing", () => {
    expect(normalizeExerciseSearch("  SENTADILLA  ")).toBe("sentadilla");
  });

  it("only reports a filter when the normalized search is non-empty", () => {
    expect(hasActiveExerciseFilters("   ")).toBe(false);
    expect(hasActiveExerciseFilters("sentadilla")).toBe(true);
  });

  it("returns every exercise when the search is empty", () => {
    expect(filterExercises(exercises, "")).toEqual(exercises);
    expect(filterExercises(exercises, "   ")).toEqual(exercises);
  });

  it("filters exercises by name without case sensitivity", () => {
    expect(filterExercises(exercises, " PRESS ")).toEqual([exercises[1]]);
  });
});
