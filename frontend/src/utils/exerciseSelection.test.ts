import { describe, expect, it } from "vitest";

import type { ExerciseResponse } from "../types/Exercise";
import {
  INVALID_EXERCISE_ID_MESSAGE,
  UNAVAILABLE_EXERCISE_MESSAGE,
  parseExerciseId,
  resolveExerciseSelection,
} from "./exerciseSelection";

const exercises: ExerciseResponse[] = [
  {
    id: 7,
    name: "Sentadilla",
    category: "GYMNASTICS",
    measurementType: "REPS",
    active: true,
  },
];

describe("exercise selection", () => {
  it("parses only positive integer IDs", () => {
    expect(parseExerciseId("7")).toBe(7);
    expect(parseExerciseId("0")).toBeUndefined();
    expect(parseExerciseId("1.5")).toBeUndefined();
    expect(parseExerciseId("abc")).toBeUndefined();
  });

  it("keeps the manual selector available when the parameter is missing", () => {
    expect(resolveExerciseSelection(exercises, null)).toEqual({
      selectedExerciseId: undefined,
      error: null,
    });
  });

  it("returns a recoverable error for invalid IDs", () => {
    expect(resolveExerciseSelection(exercises, "invalid")).toEqual({
      selectedExerciseId: undefined,
      error: INVALID_EXERCISE_ID_MESSAGE,
    });
  });

  it("returns a recoverable error for unavailable exercises", () => {
    expect(resolveExerciseSelection(exercises, "8")).toEqual({
      selectedExerciseId: undefined,
      error: UNAVAILABLE_EXERCISE_MESSAGE,
    });
  });

  it("resolves the selected exercise context", () => {
    expect(resolveExerciseSelection(exercises, "7")).toEqual({
      selectedExerciseId: 7,
      error: null,
    });
  });
});
