import { describe, expect, it } from "vitest";

import type { ExerciseResponse } from "../../types/Exercise";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import { filterExerciseResults } from "./exerciseResultsFilter";

function createExercise(id: number, name: string): ExerciseResponse {
  return {
    id,
    name,
    category: "OTHER",
    measurementType: "REPS",
    active: true,
  };
}

function createResult(
  id: number,
  exerciseId: number,
): ExerciseResultResponse {
  return {
    id,
    exerciseId,
    exerciseName: `Exercise ${exerciseId}`,
    measurementType: "REPS",
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
  createResult(2, 30),
  createResult(3, 20),
];

const exercises = [
  createExercise(10, "Back Squat"),
  createExercise(20, "Hang Squat Clean"),
  createExercise(30, "Push Press"),
];

describe("exercise result filtering", () => {
  it("returns all results for empty or whitespace-only text", () => {
    expect(filterExerciseResults(results, exercises, "")).toEqual(results);
    expect(filterExerciseResults(results, exercises, "   ")).toEqual(results);
  });

  it("matches partial exercise names while preserving result order", () => {
    expect(
      filterExerciseResults(results, exercises, "squat").map(
        (result) => result.id,
      ),
    ).toEqual([1, 3]);
  });

  it("ignores case and surrounding spaces", () => {
    expect(
      filterExerciseResults(results, exercises, "  sQuAt  ").map(
        (result) => result.id,
      ),
    ).toEqual([1, 3]);
  });

  it("returns an empty list when no exercise name matches", () => {
    expect(filterExerciseResults(results, exercises, "deadlift")).toEqual([]);
  });

  it("restores all results when the search text is cleared", () => {
    expect(filterExerciseResults(results, exercises, "squat")).toHaveLength(2);
    expect(filterExerciseResults(results, exercises, "")).toHaveLength(3);
  });

  it("matches an exercise by its ID before filtering personal results", () => {
    expect(
      filterExerciseResults(results, exercises, "push").map(
        (result) => result.exerciseId,
      ),
    ).toEqual([30]);
  });
});
