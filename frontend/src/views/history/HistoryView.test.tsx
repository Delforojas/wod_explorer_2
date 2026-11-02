import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HistoryView from "./HistoryView";
import type { HistoryViewProps } from "./HistoryView.Types";

const entries: HistoryViewProps["entries"] = [
  {
    kind: "WOD",
    result: {
      id: 1,
      wodId: 2,
      wodName: "Fran",
      origin: "GENERIC",
      wodVersionId: 3,
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
    },
  },
  {
    kind: "EXERCISE",
    result: {
      id: 4,
      exerciseId: 5,
      exerciseName: "Back Squat",
      measurementType: "WEIGHT",
      reps: 5,
      weightKg: 100,
      distanceM: null,
      durationSeconds: null,
      performedAt: "2026-01-09T10:00:00",
      createdAt: null,
    },
  },
];

function renderView(overrides: Partial<HistoryViewProps> = {}): string {
  const props: HistoryViewProps = {
    entries,
    wods: [{ id: 2, name: "Fran" }],
    mode: "ALL",
    filters: { wodId: "", type: "", origin: "", from: "", to: "" },
    wodLoading: false,
    exerciseLoading: false,
    wodError: null,
    exerciseError: null,
    onFilterChange: () => undefined,
    onModeChange: () => undefined,
    onApplyFilters: () => undefined,
    onClearFilters: () => undefined,
    onRetryWods: () => undefined,
    onRetryExercises: () => undefined,
    ...overrides,
  };

  return renderToStaticMarkup(<HistoryView {...props} />);
}

describe("history view", () => {
  it("renders mixed WOD and exercise entries with explicit types", () => {
    const markup = renderView();

    expect(markup).toContain("Fran");
    expect(markup).toContain("Back Squat");
    expect(markup).toContain(">WOD</span>");
    expect(markup).toContain(">Ejercicio</span>");
    expect(markup).toContain("Todos");
    expect(markup).toContain("WODs");
    expect(markup).toContain("Ejercicios");
  });

  it("keeps available data visible when one source fails", () => {
    const markup = renderView({
      entries: entries.slice(0, 1),
      exerciseError: "exercise source failed",
    });

    expect(markup).toContain("Fran");
    expect(markup).toContain("No se pudieron cargar los resultados de ejercicios.");
    expect(markup).toContain("Reintentar ejercicios");
  });

  it("shows a clear total error when both sources fail", () => {
    const markup = renderView({
      entries: [],
      wodError: "wod source failed",
      exerciseError: "exercise source failed",
    });

    expect(markup).toContain("No se pudo cargar ninguna actividad del historial");
    expect(markup).toContain("Reintentar WODs");
    expect(markup).toContain("Reintentar ejercicios");
  });
});
