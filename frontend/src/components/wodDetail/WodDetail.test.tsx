// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import WodDetailLayout from "./WodDetail";
import PublicWodDetail from "../wodFilter/WodDetail";
import type { WodAggregateResponse } from "../../types/Wod";
import MyWodDetail from "../../views/my-wods/components/MyWodDetail";

const authState = vi.hoisted(() => ({
  isAuthenticated: false,
}));

vi.mock("../../auth/useAuth", () => ({
  useAuth: () => authState,
}));

const wod: WodAggregateResponse = {
  id: 17,
  ownerId: 4,
  name: "Engine Builder",
  origin: "PERSONAL",
  category: "CROSSTRAINING",
  createdAt: "2026-11-02T10:00:00Z",
  version: {
    id: 22,
    wodId: 17,
    wodName: "Engine Builder",
    versionNumber: 3,
    type: "FOR_TIME",
    timeCapSeconds: 600,
    rounds: 5,
    progressionRule: null,
    timeExtension: null,
    createdAt: "2026-11-02T10:00:00Z",
  },
  composition: [
    {
      id: 1,
      wodVersionId: 22,
      exerciseId: 10,
      exerciseName: "Back Squat",
      position: 1,
      reps: 10,
      weightKg: 60,
      distanceM: null,
      durationSeconds: null,
      calories: null,
      prescriptions: [],
    },
    {
      id: 2,
      wodVersionId: 22,
      exerciseId: 20,
      exerciseName: "Run",
      position: 2,
      reps: null,
      weightKg: null,
      distanceM: 400,
      durationSeconds: 120,
      calories: null,
      prescriptions: [],
    },
  ],
};

const publicWod: WodAggregateResponse = {
  ...wod,
  origin: "GENERIC",
};

function renderDetail(element: React.ReactElement): string {
  return renderToStaticMarkup(
    <MemoryRouter>{element}</MemoryRouter>,
  );
}

describe("shared WOD detail presentation", () => {
  beforeEach(() => {
    authState.isAuthenticated = false;
  });

  afterEach(() => {
    cleanup();
  });

  it("hides the public registration CTA for visitors", () => {
    const markup = renderDetail(
      <PublicWodDetail selectedWod={publicWod} onBack={() => undefined} />,
    );

    expect(markup).toContain("Engine Builder");
    expect(markup).toContain("For Time");
    expect(markup).toContain("5 ciclos");
    expect(markup).toContain("10 min límite");
    expect(markup.indexOf("Back Squat")).toBeLessThan(markup.indexOf("Run"));
    expect(markup).toContain('class="wod-detail-primary">10</span>');
    expect(markup).toContain("60 kg");
    expect(markup).toContain('class="wod-detail-primary">400 m</span>');
    expect(markup).toContain("120 s");
    expect(markup).not.toContain("Registrar resultado");
    expect(markup).not.toContain("/my-wod-results/new");
  });

  it("shows the public registration CTA for authenticated users", () => {
    authState.isAuthenticated = true;

    const markup = renderDetail(
      <PublicWodDetail selectedWod={publicWod} onBack={() => undefined} />,
    );

    expect(markup).toContain("Registrar resultado");
    expect(markup).toContain('class="wod-detail-register"');
    expect(markup).toContain('href="/my-wod-results/new?wodId=17"');
  });

  it("keeps the personal registration route and CTA for the owner", () => {
    authState.isAuthenticated = true;

    const markup = renderDetail(
      <MyWodDetail selectedWod={wod} onBack={() => undefined} />,
    );

    expect(markup).toContain("MI ENTRENAMIENTO");
    expect(markup).toContain("Registrar resultado");
    expect(markup).toContain('class="wod-detail-register"');
    expect(markup).toContain('href="/my-wod-results/new?wodId=17"');
  });

  it("makes an AMRAP prescription immediately readable as recurring work", () => {
    const cindy: WodAggregateResponse = {
      ...publicWod,
      name: "Cindy",
      version: {
        ...publicWod.version,
        type: "AMRAP",
        rounds: null,
        timeCapSeconds: 1200,
      },
      composition: [
        {
          ...publicWod.composition[0],
          exerciseName: "Pull-ups",
          reps: 5,
        },
        {
          ...publicWod.composition[1],
          exerciseName: "Push-ups",
          reps: 10,
          distanceM: null,
          durationSeconds: null,
        },
        {
          ...publicWod.composition[1],
          id: 3,
          position: 3,
          exerciseName: "Air Squats",
          reps: 15,
          distanceM: null,
          durationSeconds: null,
        },
      ],
    };

    const markup = renderDetail(
      <PublicWodDetail selectedWod={cindy} onBack={() => undefined} />,
    );

    expect(markup).toContain("Cindy");
    expect(markup).toContain("AMRAP");
    expect(markup).toContain("20 min de trabajo");
    expect(markup).toContain('class="wod-detail-primary">5</span>');
    expect(markup).toContain('class="wod-detail-primary">10</span>');
    expect(markup).toContain('class="wod-detail-primary">15</span>');
    expect(markup.indexOf("Pull-ups")).toBeLessThan(markup.indexOf("Push-ups"));
    expect(markup.indexOf("Push-ups")).toBeLessThan(markup.indexOf("Air Squats"));
  });

  it("keeps non-repetition prescriptions for EMOM without inventing a cycle", () => {
    const emom: WodAggregateResponse = {
      ...publicWod,
      version: {
        ...publicWod.version,
        type: "EMOM",
        rounds: null,
        timeCapSeconds: null,
      },
      composition: [
        {
          ...publicWod.composition[1],
          reps: null,
          distanceM: 200,
          durationSeconds: 45,
        },
      ],
    };

    const markup = renderDetail(
      <PublicWodDetail selectedWod={emom} onBack={() => undefined} />,
    );

    expect(markup).toContain("EMOM");
    expect(markup).toContain('class="wod-detail-primary">200 m</span>');
    expect(markup).toContain("45 s");
    expect(markup).not.toContain("ciclos");
  });

  it("uses one highlighted column for distance, calories, duration, and repetitions", () => {
    const mixedWork: WodAggregateResponse = {
      ...publicWod,
      composition: [
        {
          ...publicWod.composition[0],
          exerciseName: "Sled Push",
          reps: null,
          distanceM: 50,
          weightKg: 202,
        },
        {
          ...publicWod.composition[1],
          exerciseName: "Row",
          distanceM: null,
          durationSeconds: null,
          calories: 20,
        },
        {
          ...publicWod.composition[1],
          id: 3,
          exerciseName: "Plank",
          distanceM: null,
          durationSeconds: 60,
          calories: null,
        },
        {
          ...publicWod.composition[0],
          id: 4,
          exerciseName: "Thruster",
          reps: 21,
          weightKg: 43,
          prescriptions: [
            { variant: "MEN", weightKg: 45.359 },
            { variant: "WOMEN", weightKg: 29.484 },
          ],
        },
      ],
    };

    const markup = renderDetail(
      <PublicWodDetail selectedWod={mixedWork} onBack={() => undefined} />,
    );

    expect(markup).toContain('class="wod-detail-primary">50 m</span>');
    expect(markup).toContain('class="wod-detail-primary">20 cal</span>');
    expect(markup).toContain('class="wod-detail-primary">60 s</span>');
    expect(markup).toContain('class="wod-detail-primary">21</span>');
    expect(markup).toContain("202 kg");
    expect(markup).toContain("43 kg");
    expect(markup).toContain("Hombres 45.359 kg");
    expect(markup).toContain("Mujeres 29.484 kg");
    expect(markup.match(/>50 m</g)).toHaveLength(1);
    expect(markup.match(/>20 cal</g)).toHaveLength(1);
    expect(markup.match(/>60 s</g)).toHaveLength(1);
  });

  it("copies only the visible WOD name and confirms after the operation completes", async () => {
    let resolveCopy: (() => void) | undefined;
    const writeText = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveCopy = resolve;
        }),
    );

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <WodDetailLayout
        selectedWod={publicWod}
        onBack={() => undefined}
        eyebrow="WOD"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copiar nombre" }));

    expect(writeText).toHaveBeenCalledWith("Engine Builder");
    expect(screen.queryByText("Copiado")).toBeNull();

    resolveCopy?.();

    expect((await screen.findByText("Copiado")).getAttribute("role")).toBe("status");
  });

  it("shows a failure message when copying the WOD name is rejected", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Denied"));

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <WodDetailLayout
        selectedWod={publicWod}
        onBack={() => undefined}
        eyebrow="WOD"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copiar nombre" }));

    const feedback = await screen.findByText("No se pudo copiar el nombre.");

    expect(feedback.getAttribute("role")).toBe("status");
    expect(screen.queryByText("Copiado")).toBeNull();

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("Engine Builder");
    });
  });
});
