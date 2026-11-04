// @vitest-environment jsdom
import { act, useEffect } from "react";
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ExerciseResponse } from "../../types/Exercise";
import type { WodAggregateResponse } from "../../types/Wod";

const api = vi.hoisted(() => ({
  getMyWods: vi.fn(),
  getWodById: vi.fn(),
  updateWod: vi.fn(),
  deleteWod: vi.fn(),
  getExercises: vi.fn(),
}));

vi.mock("../../api/wodsApi", () => ({
  getMyWods: api.getMyWods,
  getWodById: api.getWodById,
  updateWod: api.updateWod,
  deleteWod: api.deleteWod,
}));

vi.mock("../../api/exercisesApi", () => ({
  getExercises: api.getExercises,
}));

import { useMyWods } from "./useMyWods";

const exercise: ExerciseResponse = {
  id: 10,
  name: "Back Squat",
  category: "WEIGHTLIFTING",
  measurementType: "REPS",
  active: true,
};

function createWod(
  overrides: Partial<WodAggregateResponse> = {},
): WodAggregateResponse {
  return {
    id: 7,
    ownerId: 4,
    name: "Morning Engine",
    origin: "PERSONAL",
    category: "CROSSTRAINING",
    createdAt: "2026-11-02T10:00:00Z",
    version: {
      id: 11,
      wodId: 7,
      wodName: "Morning Engine",
      versionNumber: 1,
      type: "FOR_TIME",
      timeCapSeconds: 300,
      rounds: 5,
      progressionRule: null,
      timeExtension: null,
      createdAt: "2026-11-02T10:00:00Z",
    },
    composition: [
      {
        id: 1,
        wodVersionId: 11,
        exerciseId: 10,
        exerciseName: "Back Squat",
        position: 1,
        reps: 10,
        weightKg: null,
        distanceM: null,
        durationSeconds: null,
        calories: null,
        prescriptions: [],
      },
    ],
    ...overrides,
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

let hook: ReturnType<typeof useMyWods>;

function UpdateHarness() {
  const state = useMyWods();

  useEffect(() => {
    hook = state;
  }, [state]);

  return (
    <form onSubmit={state.onUpdateWod}>
      <button type="submit">Guardar cambios</button>
    </form>
  );
}

beforeEach(() => {
  api.getMyWods.mockReset();
  api.getWodById.mockReset();
  api.updateWod.mockReset();
  api.deleteWod.mockReset();
  api.getExercises.mockReset();

  api.getMyWods.mockResolvedValue([]);
  api.getExercises.mockResolvedValue([exercise]);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("useMyWods initial load", () => {
  it("loads WODs and exercises and finishes the loading state", async () => {
    const wod = createWod();
    api.getMyWods.mockResolvedValue([wod]);

    const { result } = renderHook(() => useMyWods());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wods).toEqual([wod]);
    expect(result.current.exercises).toEqual([exercise]);
    expect(result.current.error).toBeNull();
  });

  it("ends the loading state with empty data", async () => {
    api.getMyWods.mockResolvedValue([]);
    api.getExercises.mockResolvedValue([]);

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wods).toEqual([]);
    expect(result.current.exercises).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("reports an error when the initial load fails", async () => {
    api.getMyWods.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("No se pudieron cargar los datos");
    expect(result.current.wods).toEqual([]);
  });
});

describe("useMyWods selection", () => {
  it("loads the selected WOD", async () => {
    const wod = createWod();
    api.getMyWods.mockResolvedValue([wod]);
    api.getWodById.mockResolvedValue(wod);

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.onSelectWod(7);
    });

    expect(api.getWodById).toHaveBeenCalledWith(7);
    expect(result.current.selectedWod).toEqual(wod);
  });

  it("reports an error when the selected WOD cannot be loaded", async () => {
    const wod = createWod();
    api.getMyWods.mockResolvedValue([wod]);
    api.getWodById.mockRejectedValue(new Error("not found"));

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.onSelectWod(7);
    });

    expect(result.current.error).toBe("No se pudo cargar el WOD");
    expect(result.current.selectedWod).toBeNull();
  });

  it("ignores a stale selection response that resolves after a newer one", async () => {
    const firstWod = createWod({ id: 7, name: "First WOD" });
    const secondWod = createWod({
      id: 8,
      name: "Second WOD",
      version: {
        ...createWod().version,
        id: 12,
        wodId: 8,
        wodName: "Second WOD",
      },
    });
    const firstRequest = deferred<WodAggregateResponse>();
    const secondRequest = deferred<WodAggregateResponse>();

    api.getMyWods.mockResolvedValue([firstWod, secondWod]);
    api.getWodById
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      void result.current.onSelectWod(7);
    });
    act(() => {
      void result.current.onSelectWod(8);
    });

    await act(async () => {
      secondRequest.resolve(secondWod);
    });

    await waitFor(() => {
      expect(result.current.selectedWod).toEqual(secondWod);
    });

    await act(async () => {
      firstRequest.resolve(firstWod);
    });

    expect(result.current.selectedWod).toEqual(secondWod);
  });
});

describe("useMyWods update", () => {
  it("updates the WOD and closes the edit state", async () => {
    const wod = createWod();
    const updatedWod = createWod({
      name: "Updated Engine",
      version: {
        ...createWod().version,
        wodName: "Updated Engine",
      },
    });
    api.getMyWods.mockResolvedValue([wod]);
    api.updateWod.mockResolvedValue(updatedWod);

    render(<UpdateHarness />);

    await waitFor(() => {
      expect(hook.loading).toBe(false);
    });

    act(() => {
      hook.onEditWod(wod);
    });
    act(() => {
      hook.onEditNameChange("Updated Engine");
    });

    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => {
      expect(api.updateWod).toHaveBeenCalledWith(
        7,
        expect.objectContaining({ name: "Updated Engine", type: "FOR_TIME" }),
      );
    });

    expect(hook.wods).toEqual([updatedWod]);
    expect(hook.editingWod).toBeNull();
    expect(hook.submitting).toBe(false);
  });

  it("keeps the edit state and reports an error when the update fails", async () => {
    const wod = createWod();
    api.getMyWods.mockResolvedValue([wod]);
    api.updateWod.mockRejectedValue(new Error("conflict"));

    render(<UpdateHarness />);

    await waitFor(() => {
      expect(hook.loading).toBe(false);
    });

    act(() => {
      hook.onEditWod(wod);
    });
    act(() => {
      hook.onEditNameChange("Updated Engine");
    });

    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => {
      expect(hook.error).toBe("No se pudo actualizar el WOD");
    });

    expect(hook.editingWod).toEqual(wod);
    expect(hook.submitting).toBe(false);
  });
});

describe("useMyWods deletion", () => {
  it("does not delete when the confirmation is cancelled", async () => {
    const wod = createWod();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    api.getMyWods.mockResolvedValue([wod]);

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.onDeleteWod(7);
    });

    expect(confirm).toHaveBeenCalledWith("¿Quieres eliminar este WOD?");
    expect(api.deleteWod).not.toHaveBeenCalled();
    expect(result.current.wods).toEqual([wod]);
  });

  it("removes the WOD from the list after confirmation", async () => {
    const wod = createWod();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    api.getMyWods.mockResolvedValue([wod]);
    api.deleteWod.mockResolvedValue(undefined);

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.onDeleteWod(7);
    });

    expect(api.deleteWod).toHaveBeenCalledWith(7);
    expect(result.current.wods).toEqual([]);
    expect(result.current.deletingId).toBeNull();
  });

  it("reports an error and keeps the WOD when deletion fails", async () => {
    const wod = createWod();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    api.getMyWods.mockResolvedValue([wod]);
    api.deleteWod.mockRejectedValue(new Error("forbidden"));

    const { result } = renderHook(() => useMyWods());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.onDeleteWod(7);
    });

    expect(result.current.error).toBe("No se pudo eliminar el WOD");
    expect(result.current.wods).toEqual([wod]);
    expect(result.current.deletingId).toBeNull();
  });
});
