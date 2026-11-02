import { describe, expect, it } from "vitest";

import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import { filterExerciseResults } from "./exerciseResultsFilter";

function createResult(
  id: number,
  exerciseId: number,
): ExerciseResultResponse {
  return {
    id,
    exerciseId,
    reps: id,
    weightKg: null,
    distanceM: null,
    durationSeconds: null,
    performedAt: `2026-01-0${id}T10:00:00Z`,
    createdAt: null,
  };
}

const results = [
  createResult(1, 10),
  createResult(2, 20),
  createResult(3, 10),
];

describe("exercise result filtering", () => {
  it("returns all results without a filter in the original order", () => {
    expect(filterExerciseResults(results, null)).toEqual(results);
  });

  it("filters by exercise ID even when exercise names could repeat", () => {
    expect(filterExerciseResults(results, 10).map((result) => result.id)).toEqual(
      [1, 3],
    );
    expect(filterExerciseResults(results, 20).map((result) => result.id)).toEqual(
      [2],
    );
  });

  it("returns an empty list when the selected exercise has no results", () => {
    expect(filterExerciseResults(results, 99)).toEqual([]);
  });

  it("restores all results when the filter is cleared", () => {
    expect(filterExerciseResults(results, 10)).toHaveLength(2);
    expect(filterExerciseResults(results, null)).toHaveLength(3);
  });

  it("derives each rapid selection from the current ID without stale results", () => {
    expect(filterExerciseResults(results, 10).map((result) => result.exerciseId)).toEqual(
      [10, 10],
    );
    expect(filterExerciseResults(results, 20).map((result) => result.exerciseId)).toEqual(
      [20],
    );
    expect(filterExerciseResults(results, 10).map((result) => result.exerciseId)).toEqual(
      [10, 10],
    );
  });
});
