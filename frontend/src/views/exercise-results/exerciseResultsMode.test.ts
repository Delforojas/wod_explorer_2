import { describe, expect, it } from "vitest";

import type { ExerciseResponse } from "../../types/Exercise";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import { filterExerciseResults } from "./exerciseResultsFilter";
import { getResultsForMode } from "./exerciseResultsMode";

function createResult(id: number): ExerciseResultResponse {
  return {
    id,
    exerciseId: id,
    exerciseName: `Exercise ${id}`,
    measurementType: "REPS",
    reps: id,
    weightKg: null,
    distanceM: null,
    durationSeconds: null,
    performedAt: "2026-01-01T10:00:00Z",
    createdAt: null,
  };
}

describe("exercise result modes", () => {
  it("selects all results by default", () => {
    const results = [createResult(1)];
    const personalBests = [createResult(2)];

    expect(getResultsForMode(results, personalBests, "all")).toEqual(results);
  });

  it("selects personal bests without changing the search source", () => {
    const results = [createResult(1)];
    const personalBests = [createResult(2)];

    expect(getResultsForMode(results, personalBests, "best")).toEqual(personalBests);
  });

  it("filters the selected mode by exercise name", () => {
    const results = [createResult(1)];
    const personalBests = [createResult(2)];
    const exercises: ExerciseResponse[] = [
      {
        id: 1,
        name: "Back Squat",
        category: "OTHER",
        measurementType: "REPS",
        active: true,
      },
      {
        id: 2,
        name: "Deadlift",
        category: "OTHER",
        measurementType: "REPS",
        active: true,
      },
    ];

    const selectedResults = getResultsForMode(results, personalBests, "best");

    expect(filterExerciseResults(selectedResults, exercises, "dead")).toEqual(
      personalBests,
    );
  });

  it("returns no results when the selected bests set is empty", () => {
    expect(getResultsForMode([createResult(1)], [], "best")).toEqual([]);
  });
});
