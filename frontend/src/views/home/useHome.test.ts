// @vitest-environment jsdom
import { act } from "react";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { WodAggregateResponse } from "../../types/Wod";
import type { WodResultResponse } from "../../types/WodResult";

const api = vi.hoisted(() => ({
  getWodResults: vi.fn(),
  getWods: vi.fn(),
}));

const auth = vi.hoisted(() => ({
  session: {
    isAuthenticated: false,
    username: null as string | null,
  },
}));

vi.mock("../../api/wodsResultsApi", () => ({
  getWodResults: api.getWodResults,
}));

vi.mock("../../api/wodsApi", () => ({
  getWods: api.getWods,
}));

vi.mock("../../auth/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: auth.session.isAuthenticated,
    username: auth.session.username,
    signIn: () => undefined,
    signOut: () => undefined,
  }),
}));

import { useHome } from "./useHome";

function createResult(id: number): WodResultResponse {
  return {
    id,
    wodId: id,
    wodName: `WOD ${id}`,
    origin: "GENERIC",
    wodVersionId: id,
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
  };
}

function createWod(
  id: number,
  category: WodAggregateResponse["category"],
  origin: WodAggregateResponse["origin"] = "GENERIC",
): WodAggregateResponse {
  return {
    id,
    ownerId: null,
    name: `WOD ${id}`,
    origin,
    category,
    createdAt: "2026-01-01T00:00:00Z",
    version: {
      id,
      wodId: id,
      wodName: `WOD ${id}`,
      versionNumber: 1,
      type: "FOR_TIME",
      timeCapSeconds: 900,
      rounds: null,
      createdAt: "2026-01-01T00:00:00Z",
    },
    composition: [],
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
  api.getWods.mockReset();

  api.getWodResults.mockResolvedValue([]);
  api.getWods.mockResolvedValue([]);
  auth.session.isAuthenticated = false;
  auth.session.username = null;
});

afterEach(() => {
  cleanup();
});

describe("useHome as a guest", () => {
  it("loads featured WODs and does not request activity", async () => {
    api.getWods.mockResolvedValue([
      createWod(1, "CROSSTRAINING"),
      createWod(2, "HYBRID"),
      createWod(3, "CROSSTRAINING"),
      createWod(4, "CROSSTRAINING", "PERSONAL"),
    ]);

    const { result } = renderHook(() => useHome());

    expect(result.current.featuredStatus).toBe("loading");

    await waitFor(() => {
      expect(result.current.featuredStatus).toBe("success");
    });

    expect(result.current.featuredWods.map((wod) => wod.id)).toEqual([1, 2, 3]);
    expect(result.current.featuredError).toBeNull();
    expect(result.current.activityStatus).toBe("idle");
    expect(result.current.activityResults).toEqual([]);
    expect(api.getWodResults).not.toHaveBeenCalled();
  });

  it("reports an empty featured list", async () => {
    api.getWods.mockResolvedValue([]);

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.featuredStatus).toBe("success");
    });

    expect(result.current.featuredWods).toEqual([]);
  });

  it("reports the API error message when featured WODs fail", async () => {
    api.getWods.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.featuredStatus).toBe("error");
    });

    expect(result.current.featuredError).toBe("network");
    expect(result.current.featuredWods).toEqual([]);
  });

  it("falls back to a safe message for non-Error failures", async () => {
    api.getWods.mockRejectedValue("boom");

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.featuredStatus).toBe("error");
    });

    expect(result.current.featuredError).toBe(
      "No se pudieron cargar los WODs destacados.",
    );
  });

  it("retries featured WODs after a failure", async () => {
    api.getWods
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce([createWod(1, "CROSSTRAINING")]);

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.featuredStatus).toBe("error");
    });

    act(() => {
      result.current.onRetryFeatured();
    });

    expect(result.current.featuredStatus).toBe("loading");

    await waitFor(() => {
      expect(result.current.featuredStatus).toBe("success");
    });

    expect(result.current.featuredWods.map((wod) => wod.id)).toEqual([1]);
  });

  it("ignores a stale featured response after a retry", async () => {
    const firstRequest = deferred<WodAggregateResponse[]>();
    const secondRequest = deferred<WodAggregateResponse[]>();

    api.getWods
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);

    const { result } = renderHook(() => useHome());

    act(() => {
      result.current.onRetryFeatured();
    });

    await act(async () => {
      secondRequest.resolve([createWod(2, "HYBRID")]);
    });

    await waitFor(() => {
      expect(result.current.featuredWods.map((wod) => wod.id)).toEqual([2]);
    });

    await act(async () => {
      firstRequest.resolve([createWod(1, "CROSSTRAINING")]);
    });

    expect(result.current.featuredWods.map((wod) => wod.id)).toEqual([2]);
  });
});

describe("useHome as an authenticated athlete", () => {
  beforeEach(() => {
    auth.session.isAuthenticated = true;
    auth.session.username = "Rogue";
  });

  it("loads recent activity and does not request featured WODs", async () => {
    api.getWodResults.mockResolvedValue([
      createResult(1),
      createResult(2),
      createResult(3),
      createResult(4),
    ]);

    const { result } = renderHook(() => useHome());

    expect(result.current.activityStatus).toBe("loading");

    await waitFor(() => {
      expect(result.current.activityStatus).toBe("success");
    });

    expect(result.current.activityResults.map((entry) => entry.id)).toEqual([
      1, 2, 3,
    ]);
    expect(result.current.activityError).toBeNull();
    expect(result.current.featuredWods).toEqual([]);
    expect(api.getWods).not.toHaveBeenCalled();
  });

  it("reports an empty activity list", async () => {
    api.getWodResults.mockResolvedValue([]);

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.activityStatus).toBe("success");
    });

    expect(result.current.activityResults).toEqual([]);
  });

  it("reports the API error message when activity fails", async () => {
    api.getWodResults.mockRejectedValue(new Error("activity down"));

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.activityStatus).toBe("error");
    });

    expect(result.current.activityError).toBe("activity down");
    expect(result.current.activityResults).toEqual([]);
  });

  it("falls back to a safe message for non-Error activity failures", async () => {
    api.getWodResults.mockRejectedValue("boom");

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.activityStatus).toBe("error");
    });

    expect(result.current.activityError).toBe(
      "No se pudo cargar tu actividad reciente.",
    );
  });

  it("retries activity after a failure", async () => {
    api.getWodResults
      .mockRejectedValueOnce(new Error("activity down"))
      .mockResolvedValueOnce([createResult(1)]);

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.activityStatus).toBe("error");
    });

    act(() => {
      result.current.onRetry();
    });

    expect(result.current.activityStatus).toBe("loading");

    await waitFor(() => {
      expect(result.current.activityStatus).toBe("success");
    });

    expect(result.current.activityResults.map((entry) => entry.id)).toEqual([1]);
  });

  it("ignores a stale activity response after a retry", async () => {
    const firstRequest = deferred<WodResultResponse[]>();
    const secondRequest = deferred<WodResultResponse[]>();

    api.getWodResults
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);

    const { result } = renderHook(() => useHome());

    act(() => {
      result.current.onRetry();
    });

    await act(async () => {
      secondRequest.resolve([createResult(2)]);
    });

    await waitFor(() => {
      expect(result.current.activityResults.map((entry) => entry.id)).toEqual([
        2,
      ]);
    });

    await act(async () => {
      firstRequest.resolve([createResult(1)]);
    });

    expect(result.current.activityResults.map((entry) => entry.id)).toEqual([2]);
  });
});
