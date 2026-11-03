// @vitest-environment jsdom
import { act } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ExerciseResponse } from "../types/Exercise";
import type { WodAggregateResponse } from "../types/Wod";

const api = vi.hoisted(() => ({
  getMyWods: vi.fn(),
  getWodById: vi.fn(),
  updateWod: vi.fn(),
  deleteWod: vi.fn(),
  getExercises: vi.fn(),
}));

vi.mock("../api/wodsApi", () => ({
  getMyWods: api.getMyWods,
  getWodById: api.getWodById,
  updateWod: api.updateWod,
  deleteWod: api.deleteWod,
}));

vi.mock("../api/exercisesApi", () => ({
  getExercises: api.getExercises,
}));

import MyWodsPage from "./MyWodsPage";

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

function renderPage() {
  return render(
    <MemoryRouter>
      <MyWodsPage />
    </MemoryRouter>,
  );
}

function inputByLabel(label: string): HTMLInputElement {
  return screen.getByLabelText(label) as HTMLInputElement;
}

function selectByLabel(label: string): HTMLSelectElement {
  return screen.getByLabelText(label) as HTMLSelectElement;
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

describe("MyWodsPage loading states", () => {
  it("shows a loading state while the initial requests are pending", async () => {
    const wodsRequest = deferred<WodAggregateResponse[]>();
    const exercisesRequest = deferred<ExerciseResponse[]>();

    api.getMyWods.mockReturnValue(wodsRequest.promise);
    api.getExercises.mockReturnValue(exercisesRequest.promise);

    renderPage();

    expect(screen.getByRole("status").textContent).toContain(
      "Cargando tus WODs...",
    );

    await act(async () => {
      wodsRequest.resolve([createWod()]);
      exercisesRequest.resolve([exercise]);
    });

    expect(
      await screen.findByRole("heading", { name: "Morning Engine" }),
    ).toBeTruthy();
  });

  it("renders the personal WODs returned by the API", async () => {
    api.getMyWods.mockResolvedValue([createWod()]);

    renderPage();

    expect(
      await screen.findByRole("heading", { name: "Morning Engine" }),
    ).toBeTruthy();
    expect(screen.getByText(/1 entrenamiento/)).toBeTruthy();
  });

  it("renders the empty state when the user has no personal WODs", async () => {
    renderPage();

    expect(
      await screen.findByText("Todavía no has creado ningún WOD."),
    ).toBeTruthy();
  });

  it("shows an error when the initial load fails", async () => {
    api.getMyWods.mockRejectedValue(new Error("network"));

    renderPage();

    expect((await screen.findByRole("alert")).textContent).toContain(
      "No se pudieron cargar los datos",
    );
  });
});

describe("MyWodsPage selection", () => {
  it("opens the detail of the selected WOD", async () => {
    const wod = createWod();
    api.getMyWods.mockResolvedValue([wod]);
    api.getWodById.mockResolvedValue(wod);

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Ver WOD Morning Engine" }),
    );

    expect(
      await screen.findByText("MI ENTRENAMIENTO"),
    ).toBeTruthy();
    expect(api.getWodById).toHaveBeenCalledWith(7);
    expect(screen.getByRole("heading", { name: "Back Squat" })).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
  });

  it("shows an error when the selected WOD cannot be loaded", async () => {
    api.getMyWods.mockResolvedValue([createWod()]);
    api.getWodById.mockRejectedValue(new Error("not found"));

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Ver WOD Morning Engine" }),
    );

    expect((await screen.findByRole("alert")).textContent).toContain(
      "No se pudo cargar el WOD",
    );
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

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Ver WOD First WOD" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Ver WOD Second WOD" }),
    );

    await act(async () => {
      secondRequest.resolve(secondWod);
    });

    expect(
      await screen.findByRole("heading", { name: "Second WOD" }),
    ).toBeTruthy();

    await act(async () => {
      firstRequest.resolve(firstWod);
    });

    expect(
      screen.getByRole("heading", { name: "Second WOD" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "First WOD" }),
    ).toBeNull();
  });

  it("returns to the list when going back from the detail", async () => {
    const wod = createWod();
    api.getMyWods.mockResolvedValue([wod]);
    api.getWodById.mockResolvedValue(wod);

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Ver WOD Morning Engine" }),
    );
    fireEvent.click(
      await screen.findByRole("button", { name: "← Volver" }),
    );

    expect(
      screen.getByRole("heading", { name: "Mis WODs" }),
    ).toBeTruthy();
  });
});

describe("MyWodsPage editing", () => {
  async function openEditForm() {
    api.getMyWods.mockResolvedValue([createWod()]);
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Editar Morning Engine" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Editar WOD" }),
    ).toBeTruthy();
  }

  it("prefills the form with the current WOD definition", async () => {
    await openEditForm();

    expect(inputByLabel("Nombre").value).toBe("Morning Engine");
    expect(selectByLabel("Modalidad").value).toBe("FOR_TIME");
    expect(inputByLabel("Rondas").value).toBe("5");
    expect(inputByLabel("Tiempo límite (segundos)").value).toBe("300");
    expect(selectByLabel("Ejercicio").value).toBe("10");
    expect(inputByLabel("Repeticiones").value).toBe("10");
  });

  it("closes the form without saving when editing is cancelled", async () => {
    await openEditForm();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(
      await screen.findByRole("heading", { name: "Mis WODs" }),
    ).toBeTruthy();
    expect(api.updateWod).not.toHaveBeenCalled();
  });

  it("adapts the visible fields when the modality changes", async () => {
    await openEditForm();

    fireEvent.change(selectByLabel("Modalidad"), {
      target: { value: "AMRAP" },
    });

    expect(screen.queryByLabelText("Rondas")).toBeNull();
    expect(
      screen.getByLabelText("Duración (segundos)"),
    ).toBeTruthy();
  });

  it("blocks the update and shows validation errors before calling the API", async () => {
    await openEditForm();

    fireEvent.change(inputByLabel("Nombre"), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "El nombre del WOD debe tener entre 1 y 100 caracteres.",
    );
    expect(api.updateWod).not.toHaveBeenCalled();
  });

  it("updates the WOD and reflects the result in the list", async () => {
    api.updateWod.mockResolvedValue(
      createWod({
        name: "Updated Engine",
        version: {
          ...createWod().version,
          wodName: "Updated Engine",
        },
      }),
    );

    await openEditForm();

    fireEvent.change(inputByLabel("Nombre"), {
      target: { value: "Updated Engine" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(
      await screen.findByRole("heading", { name: "Updated Engine" }),
    ).toBeTruthy();
    expect(api.updateWod).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ name: "Updated Engine", type: "FOR_TIME" }),
    );
  });

  it("keeps the form open and shows an error when the update fails", async () => {
    api.updateWod.mockRejectedValue(new Error("conflict"));

    await openEditForm();

    fireEvent.change(inputByLabel("Nombre"), {
      target: { value: "Updated Engine" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "No se pudo actualizar el WOD",
    );
    expect(
      screen.getByRole("heading", { name: "Editar WOD" }),
    ).toBeTruthy();
  });
});

describe("MyWodsPage deletion", () => {
  it("does not delete the WOD when the confirmation is cancelled", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    api.getMyWods.mockResolvedValue([createWod()]);

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Eliminar Morning Engine",
      }),
    );

    expect(confirm).toHaveBeenCalledWith("¿Quieres eliminar este WOD?");
    expect(api.deleteWod).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Morning Engine" }),
    ).toBeTruthy();
  });

  it("deletes the WOD after confirmation and removes it from the list", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    api.getMyWods.mockResolvedValue([createWod()]);
    api.deleteWod.mockResolvedValue(undefined);

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Eliminar Morning Engine",
      }),
    );

    await waitFor(() => {
      expect(api.deleteWod).toHaveBeenCalledWith(7);
    });

    expect(
      await screen.findByText("Todavía no has creado ningún WOD."),
    ).toBeTruthy();
  });

  it("shows an error when deletion fails", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    api.getMyWods.mockResolvedValue([createWod()]);
    api.deleteWod.mockRejectedValue(new Error("forbidden"));

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Eliminar Morning Engine",
      }),
    );

    expect((await screen.findByRole("alert")).textContent).toContain(
      "No se pudo eliminar el WOD",
    );
    expect(api.deleteWod).toHaveBeenCalledWith(7);
  });
});
