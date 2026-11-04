// @vitest-environment jsdom
import { act } from "react";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import type { WodResultResponse } from "../../types/WodResult";

const api = vi.hoisted(() => ({
  getWodResults: vi.fn(),
  getExerciseResults: vi.fn(),
}));

vi.mock("../../api/wodsResultsApi", () => ({
  getWodResults: api.getWodResults,
}));

vi.mock("../../api/exerciseResultsApi", () => ({
  getExerciseResults: api.getExerciseResults,
}));

import { useHistory } from "./useHistory";

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

function createExerciseResult(
  id: number,
  values: Partial<ExerciseResultResponse> = {},
): ExerciseResultResponse {
  return {
    id,
    exerciseId: 10,
    exerciseName: "Back Squat",
    measurementType: "REPS",
    reps: 5,
    weightKg: null,
    distanceM: null,
    durationSeconds: null,
    performedAt: "2026-01-10T10:00:00",
    createdAt: null,
    ...values,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

beforeEach(() => {
  api.getWodResults.mockReset();
  api.getExerciseResults.mockReset();

  api.getWodResults.mockResolvedValue([]);
  api.getExerciseResults.mockResolvedValue([]);
});

afterEach(() => {
  cleanup();
});

describe("useHistory initial load", () => {
  it("loads both resources and orders the history by date", async () => {
    api.getWodResults.mockResolvedValue([createWodResult(1)]);
    api.getExerciseResults.mockResolvedValue([
      createExerciseResult(2, { performedAt: "2026-01-11T10:00:00" }),
    ]);

    const { result } = renderHook(() => useHistory());

    expect(result.current.wodLoading).toBe(true);
    expect(result.current.exerciseLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
      expect(result.current.exerciseLoading).toBe(false);
    });

    expect(
      result.current.entries.map((entry) => `${entry.kind}-${entry.result.id}`),
    ).toEqual(["EXERCISE-2", "WOD-1"]);
    expect(result.current.wodError).toBeNull();
    expect(result.current.exerciseError).toBeNull();
  });

  it("reports independent errors when both resources fail", async () => {
    api.getWodResults.mockRejectedValue(new Error("wods down"));
    api.getExerciseResults.mockRejectedValue("boom");

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
      expect(result.current.exerciseLoading).toBe(false);
    });

    expect(result.current.wodError).toBe("wods down");
    expect(result.current.exerciseError).toBe("No se pudo cargar el historial");
    expect(result.current.entries).toEqual([]);
  });

  it("keeps the successful resource when the other fails", async () => {
    api.getWodResults.mockRejectedValue(new Error("wods down"));
    api.getExerciseResults.mockResolvedValue([createExerciseResult(2)]);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
      expect(result.current.exerciseLoading).toBe(false);
    });

    expect(result.current.wodError).toBe("wods down");
    expect(result.current.exerciseError).toBeNull();
    expect(result.current.entries.map((entry) => entry.kind)).toEqual([
      "EXERCISE",
    ]);
  });
});

describe("useHistory retries", () => {
  it("recovers the WOD history after a failed request", async () => {
    api.getWodResults
      .mockRejectedValueOnce(new Error("wods down"))
      .mockResolvedValueOnce([createWodResult(1)]);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.wodError).toBe("wods down");
    });

    act(() => {
      result.current.onRetryWods();
    });

    expect(result.current.wodLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
    });

    expect(result.current.wodError).toBeNull();
    expect(result.current.entries.map((entry) => entry.result.id)).toContain(1);
  });

  it("keeps the WOD error when the retry also fails", async () => {
    api.getWodResults
      .mockRejectedValueOnce(new Error("wods down"))
      .mockRejectedValueOnce(new Error("still down"));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.wodError).toBe("wods down");
    });

    act(() => {
      result.current.onRetryWods();
    });

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
    });

    expect(result.current.wodError).toBe("still down");
    expect(result.current.entries).toEqual([]);
  });

  it("recovers the exercise history after a failed request", async () => {
    api.getExerciseResults
      .mockRejectedValueOnce(new Error("exercises down"))
      .mockResolvedValueOnce([createExerciseResult(2)]);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.exerciseError).toBe("exercises down");
    });

    act(() => {
      result.current.onRetryExercises();
    });

    expect(result.current.exerciseLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.exerciseLoading).toBe(false);
    });

    expect(result.current.exerciseError).toBeNull();
    expect(result.current.entries.map((entry) => entry.result.id)).toEqual([2]);
  });
});

describe("useHistory filters", () => {
  it("applies date filters as full-day API ranges", async () => {
    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
      expect(result.current.exerciseLoading).toBe(false);
    });

    act(() => {
      result.current.onFilterChange("from", "2026-11-01");
    });
    act(() => {
      result.current.onFilterChange("to", "2026-11-30");
    });
    act(() => {
      result.current.onApplyFilters();
    });

    expect(result.current.filters).toEqual({
      from: "2026-11-01",
      to: "2026-11-30",
    });
    expect(result.current.appliedFilters).toEqual({
      from: "2026-11-01",
      to: "2026-11-30",
    });
    expect(result.current.dateFiltersOpen).toBe(false);
    expect(result.current.wodLoading).toBe(true);
    expect(result.current.exerciseLoading).toBe(true);
    expect(api.getWodResults).toHaveBeenLastCalledWith({
      from: "2026-11-01T00:00:00",
      to: "2026-11-30T23:59:59",
    });

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
      expect(result.current.exerciseLoading).toBe(false);
    });
  });

  it("clears the filters and requests the unfiltered history again", async () => {
    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
    });

    act(() => {
      result.current.onFilterChange("from", "2026-11-01");
    });
    act(() => {
      result.current.onApplyFilters();
    });

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
    });

    expect(result.current.appliedFilters).toEqual({
      from: "2026-11-01",
      to: "",
    });

    act(() => {
      result.current.onClearFilters();
    });

    expect(result.current.filters).toEqual({ from: "", to: "" });
    expect(result.current.appliedFilters).toEqual({ from: "", to: "" });
    expect(result.current.dateFiltersOpen).toBe(false);
    expect(api.getWodResults).toHaveBeenLastCalledWith({
      from: undefined,
      to: undefined,
    });

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
    });
  });

  it("filters the loaded entries by mode without new requests", async () => {
    api.getWodResults.mockResolvedValue([createWodResult(1)]);
    api.getExerciseResults.mockResolvedValue([createExerciseResult(2)]);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.wodLoading).toBe(false);
      expect(result.current.exerciseLoading).toBe(false);
    });

    act(() => {
      result.current.onModeChange("WODS");
    });

    expect(result.current.mode).toBe("WODS");
    expect(result.current.entries.map((entry) => entry.kind)).toEqual(["WOD"]);

    act(() => {
      result.current.onModeChange("EXERCISES");
    });

    expect(result.current.entries.map((entry) => entry.kind)).toEqual([
      "EXERCISE",
    ]);
    expect(api.getWodResults).toHaveBeenCalledTimes(1);
    expect(api.getExerciseResults).toHaveBeenCalledTimes(1);
  });

  it("ignores a stale history response after the filters change", async () => {
    const firstRequest = deferred<WodResultResponse[]>();
    const secondRequest = deferred<WodResultResponse[]>();

    api.getWodResults
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);

    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.onFilterChange("from", "2026-11-01");
    });
    act(() => {
      result.current.onApplyFilters();
    });

    await waitFor(() => {
      expect(api.getWodResults).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      secondRequest.resolve([
        createWodResult(2, {
          wodName: "Filtered WOD",
          performedAt: "2026-11-15T10:00:00",
        }),
      ]);
    });

    await waitFor(() => {
      expect(
        result.current.entries.some(
          (entry) =>
            entry.kind === "WOD" && entry.result.wodName === "Filtered WOD",
        ),
      ).toBe(true);
    });

    await act(async () => {
      firstRequest.resolve([
        createWodResult(1, {
          wodName: "Stale WOD",
          performedAt: "2026-11-15T10:00:00",
        }),
      ]);
    });

    const wodNames = result.current.entries.flatMap((entry) =>
      entry.kind === "WOD" ? [entry.result.wodName] : [],
    );

    expect(wodNames).toEqual(["Filtered WOD"]);
  });
});
