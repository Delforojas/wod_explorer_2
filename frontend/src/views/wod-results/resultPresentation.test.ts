import { describe, expect, it } from "vitest";

import type { WodResultResponse } from "../../types/WodResult";
import { getWodResultLines } from "./resultPresentation";

function createResult(
  overrides: Partial<WodResultResponse> = {},
): WodResultResponse {
  return {
    id: 1,
    wodId: 1,
    wodName: "Fran",
    origin: "GENERIC",
    wodVersionId: 10,
    type: "FOR_TIME",
    performedAt: "2026-01-01T10:00:00",
    completed: true,
    timeSeconds: 300,
    progressRounds: null,
    progressItemId: null,
    progressReps: null,
    progressDistanceM: null,
    progressDurationSeconds: null,
    amrapRounds: null,
    amrapExtraReps: null,
    createdAt: "2026-01-01T10:00:00",
    ...overrides,
  };
}

describe("WOD result presentation", () => {
  it("formats completed FOR_TIME results", () => {
    expect(getWodResultLines(createResult())).toEqual(["Tiempo: 5:00"]);
  });

  it("preserves AMRAP rounds and extra repetitions", () => {
    expect(
      getWodResultLines(
        createResult({
          type: "AMRAP",
          completed: null,
          timeSeconds: null,
          amrapRounds: 8,
          amrapExtraReps: 5,
        }),
      ),
    ).toEqual(["8 rondas + 5 reps"]);
  });

  it("shows incomplete FOR_TIME progress", () => {
    expect(
      getWodResultLines(
        createResult({
          completed: false,
          timeSeconds: null,
          progressRounds: 4,
          progressReps: 7,
        }),
      ),
    ).toEqual(["No completado", "Rondas completadas: 4", "Progreso: 7 reps"]);
  });
});
