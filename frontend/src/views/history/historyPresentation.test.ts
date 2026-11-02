import { describe, expect, it } from "vitest";

import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import type { WodResultResponse } from "../../types/WodResult";
import {
  filterHistoryEntries,
  getExerciseResultLines,
  normalizeHistoryResults,
} from "./historyPresentation";
import type { HistoryFilterValues } from "./HistoryView.Types";

const emptyFilters: HistoryFilterValues = {
  wodId: "",
  type: "",
  origin: "",
  from: "",
  to: "",
};

function createExerciseResult(
  id: number,
  measurementType: ExerciseResultResponse["measurementType"],
  values: Partial<ExerciseResultResponse> = {},
): ExerciseResultResponse {
  return {
    id,
    exerciseId: 10,
    exerciseName: "Back Squat",
    measurementType,
    reps: null,
    weightKg: null,
    distanceM: null,
    durationSeconds: null,
    performedAt: "2026-01-10T10:00:00",
    createdAt: null,
    ...values,
  };
}

function createWodResult(
  id: number,
  values: Partial<WodResultResponse> = {},
): WodResultResponse {
  return {
    id,
    wodId: 20,
    wodName: "Fran",
    origin: "GENERIC",
    wodVersionId: 30,
    type: "FOR_TIME",
    performedAt: "2026-01-10T10:00:00",
    completed: true,
    timeSeconds: 120,
    progressRounds: null,
    progressItemId: null,
    progressReps: null,
    progressDistanceM: null,
    progressDurationSeconds: null,
    amrapRounds: null,
    amrapExtraReps: null,
    createdAt: "2026-01-10T10:00:00",
    ...values,
  };
}

describe("history presentation", () => {
  it("merges results by date, puts exercises before WODs on ties, and uses descending IDs within a type", () => {
    const entries = normalizeHistoryResults(
      [
        createWodResult(4),
        createWodResult(8, { performedAt: "2026-01-11T10:00:00" }),
      ],
      [
        createExerciseResult(2, "REPS"),
        createExerciseResult(9, "REPS"),
      ],
    );

    expect(entries.map((entry) => `${entry.kind}-${entry.result.id}`)).toEqual([
      "WOD-8",
      "EXERCISE-9",
      "EXERCISE-2",
      "WOD-4",
    ]);
  });

  it("applies mode, WOD filters, and an inclusive date range", () => {
    const entries = normalizeHistoryResults(
      [
        createWodResult(1, { performedAt: "2026-01-10T23:59:59" }),
        createWodResult(2, {
          wodId: 99,
          type: "AMRAP",
          origin: "PERSONAL",
          performedAt: "2026-01-11T00:00:00",
        }),
      ],
      [createExerciseResult(3, "REPS", { performedAt: "2026-01-10T12:00:00" })],
    );

    expect(
      filterHistoryEntries(entries, "WODS", {
        ...emptyFilters,
        wodId: "99",
        type: "AMRAP",
        origin: "PERSONAL",
        from: "2026-01-11",
        to: "2026-01-11",
      }).map((entry) => entry.result.id),
    ).toEqual([2]);

    expect(
      filterHistoryEntries(entries, "EXERCISES", {
        ...emptyFilters,
        from: "2026-01-10",
        to: "2026-01-10",
      }).map((entry) => entry.result.id),
    ).toEqual([3]);
  });

  it("formats every supported exercise measurement type", () => {
    expect(
      getExerciseResultLines(
        createExerciseResult("weight".length, "WEIGHT", {
          weightKg: 100,
          reps: 5,
        }),
      ),
    ).toEqual(["100 kg × 5 reps"]);
    expect(getExerciseResultLines(createExerciseResult(2, "REPS", { reps: 12 }))).toEqual([
      "12 reps",
    ]);
    expect(
      getExerciseResultLines(
        createExerciseResult(3, "TIME", { durationSeconds: 90 }),
      ),
    ).toEqual(["1:30"]);
    expect(
      getExerciseResultLines(createExerciseResult(4, "DISTANCE", { distanceM: 5000 })),
    ).toEqual(["5000 m"]);
    expect(
      getExerciseResultLines(
        createExerciseResult(5, "WEIGHT_DISTANCE", {
          weightKg: 20,
          distanceM: 400,
        }),
      ),
    ).toEqual(["20 kg · 400 m"]);
    expect(
      getExerciseResultLines(
        createExerciseResult(6, "DISTANCE_TIME", {
          distanceM: 5000,
          durationSeconds: 1472,
        }),
      ),
    ).toEqual(["5000 m · 24:32"]);
  });
});
