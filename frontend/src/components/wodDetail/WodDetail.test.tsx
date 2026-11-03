import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import WodDetail from "../wodFilter/WodDetail";
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

  it("hides the public registration CTA for visitors", () => {
    const markup = renderDetail(
      <WodDetail selectedWod={publicWod} onBack={() => undefined} />,
    );

    expect(markup).toContain("Engine Builder");
    expect(markup).toContain("For Time");
    expect(markup).toContain("5 ciclos");
    expect(markup).toContain("10 min límite");
    expect(markup.indexOf("Back Squat")).toBeLessThan(markup.indexOf("Run"));
    expect(markup).toContain('class="wod-detail-reps">10</span>');
    expect(markup).toContain("reps");
    expect(markup).toContain("60 kg");
    expect(markup).toContain("400 m");
    expect(markup).toContain("120 segundos");
    expect(markup).not.toContain("Registrar resultado");
    expect(markup).not.toContain("/my-wod-results/new");
  });

  it("shows the public registration CTA for authenticated users", () => {
    authState.isAuthenticated = true;

    const markup = renderDetail(
      <WodDetail selectedWod={publicWod} onBack={() => undefined} />,
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
      <WodDetail selectedWod={cindy} onBack={() => undefined} />,
    );

    expect(markup).toContain("Cindy");
    expect(markup).toContain("AMRAP");
    expect(markup).toContain("20 min de trabajo");
    expect(markup).toContain('class="wod-detail-reps">5</span>');
    expect(markup).toContain('class="wod-detail-reps">10</span>');
    expect(markup).toContain('class="wod-detail-reps">15</span>');
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
      <WodDetail selectedWod={emom} onBack={() => undefined} />,
    );

    expect(markup).toContain("EMOM");
    expect(markup).toContain("200 m");
    expect(markup).toContain("45 segundos");
    expect(markup).not.toContain("ciclos");
  });
});
