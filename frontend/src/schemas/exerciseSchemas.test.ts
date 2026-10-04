import { describe, expect, it } from "vitest";
import {
  exerciseResponseListSchema,
  exerciseResponseSchema,
} from "./exerciseSchemas";

describe("exercise response schemas", () => {
  it("accepts a valid exercise response", () => {
    const result = exerciseResponseSchema.safeParse({
      id: 1,
      name: "Sentadilla",
      category: "GYMNASTICS",
      measurementType: "REPS",
      active: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown measurement types", () => {
    const result = exerciseResponseSchema.safeParse({
      id: 1,
      name: "Sentadilla",
      category: "GYMNASTICS",
      measurementType: "UNKNOWN",
      active: true,
    });

    expect(result.success).toBe(false);
  });

  it("validates response collections at the API boundary", () => {
    const result = exerciseResponseListSchema.safeParse([
      {
        id: 1,
        name: "Sentadilla",
        category: "GYMNASTICS",
        measurementType: "REPS",
        active: true,
      },
    ]);

    expect(result.success).toBe(true);
  });
});
