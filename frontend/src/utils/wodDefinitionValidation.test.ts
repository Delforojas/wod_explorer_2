import { describe, expect, it } from "vitest";

import type { ExerciseResponse } from "../types/Exercise";
import type { WodDefinitionRequest } from "../types/Wod";
import { validateWodDefinition } from "./wodDefinitionValidation";

const exercises: ExerciseResponse[] = [
  { id: 1, name: "Reps", category: "GYMNASTICS", measurementType: "REPS", active: true },
  { id: 2, name: "Weight", category: "WEIGHTLIFTING", measurementType: "WEIGHT", active: true },
  { id: 3, name: "Time", category: "CARDIO", measurementType: "TIME", active: true },
  { id: 4, name: "Distance", category: "CARDIO", measurementType: "DISTANCE", active: true },
  { id: 5, name: "Weight distance", category: "STRONGMAN", measurementType: "WEIGHT_DISTANCE", active: true },
  { id: 6, name: "Distance time", category: "CARDIO", measurementType: "DISTANCE_TIME", active: true },
];

function request(
  exerciseId: number,
  prescription: Omit<WodDefinitionRequest["items"][number], "exerciseId">,
): WodDefinitionRequest {
  return {
    name: "Entrenamiento",
    type: "FOR_TIME",
    items: [{ exerciseId, ...prescription }],
  };
}

describe("validateWodDefinition", () => {
  it.each([
    ["REPS", request(1, { reps: 10 })],
    ["WEIGHT", request(2, { reps: 5, weightKg: 40 })],
    ["TIME", request(3, { durationSeconds: 60 })],
    ["DISTANCE", request(4, { distanceM: 400 })],
    ["WEIGHT_DISTANCE", request(5, { weightKg: 20, distanceM: 100 })],
    ["DISTANCE_TIME", request(6, { distanceM: 500, durationSeconds: 120 })],
  ])("accepts a complete %s prescription", (_measurement, value) => {
    expect(validateWodDefinition(value, exercises)).toEqual([]);
  });

  it("identifies missing DISTANCE_TIME fields", () => {
    const errors = validateWodDefinition(request(6, {}), exercises);

    expect(errors.map((error) => error.path)).toEqual([
      "items.0.distanceM",
      "items.0.durationSeconds",
    ]);
    expect(errors[0].message).toContain("Distance time");
  });

  it("rejects fields that do not match the exercise measurement", () => {
    const errors = validateWodDefinition(
      request(4, { distanceM: 400, durationSeconds: 30 }),
      exercises,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].path).toBe("items.0.durationSeconds");
  });

  it("rejects unavailable exercises and invalid values", () => {
    const unavailable = validateWodDefinition(request(99, { reps: 10 }), exercises);
    const negative = validateWodDefinition(request(1, { reps: -1 }), exercises);

    expect(unavailable[0].message).toContain("no está disponible");
    expect(negative[0].path).toBe("items.0.reps");
  });

  it("requires a time cap for AMRAP and EMOM", () => {
    const errors = validateWodDefinition(
      { ...request(1, { reps: 10 }), type: "AMRAP" },
      exercises,
    );

    expect(errors[0]).toEqual({
      path: "timeCapSeconds",
      message: "AMRAP y EMOM requieren un tiempo límite positivo.",
    });
  });
});
