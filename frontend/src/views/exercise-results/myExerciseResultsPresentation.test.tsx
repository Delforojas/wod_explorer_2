import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { ExerciseResponse } from "../../types/Exercise";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import MyExerciseResultsView from "./MyExerciseResultsView";
import type { MyExerciseResultsViewProps } from "./MyExerciseResultsView.Types";

function createExercise(id: number, name: string): ExerciseResponse {
  return {
    id,
    name,
    category: "OTHER",
    measurementType: "REPS",
    active: true,
  };
}

function createResult(id: number, exerciseId: number): ExerciseResultResponse {
  return {
    id,
    exerciseId,
    reps: 10,
    weightKg: null,
    distanceM: null,
    durationSeconds: null,
    performedAt: "2026-01-01T10:00:00Z",
    createdAt: null,
  };
}

const exercises = [createExercise(10, "Snatch"), createExercise(20, "Snatch")];
const results = [createResult(1, 10)];

function renderView(
  overrides: Partial<MyExerciseResultsViewProps> = {},
): string {
  const props: MyExerciseResultsViewProps = {
    results,
    exercises,
    loading: false,
    error: null,
    onRetry: () => undefined,
    ...overrides,
  };

  return renderToStaticMarkup(
    <MemoryRouter>
      <MyExerciseResultsView {...props} />
    </MemoryRouter>,
  );
}

describe("my exercise results presentation", () => {
  it("renders the exercise filter with an all-exercises option and preserves registration", () => {
    const markup = renderView();

    expect(markup).toContain("Ejercicio");
    expect(markup).toContain("Todos los ejercicios");
    expect(markup).toContain('value="10"');
    expect(markup).toContain('value="20"');
    expect(markup).toContain('href="/exercise-results/new"');
    expect(markup).not.toContain("Mejores marcas");
  });

  it("renders loading, error with recovery, and empty states", () => {
    const loadingMarkup = renderView({ loading: true });
    const errorMarkup = renderView({ error: "No se pudieron cargar tus marcas" });
    const emptyMarkup = renderView({ results: [] });

    expect(loadingMarkup).toContain("Cargando tus marcas...");
    expect(errorMarkup).toContain("No se pudieron cargar tus marcas");
    expect(errorMarkup).toContain("Reintentar");
    expect(emptyMarkup).toContain("Todavía no has registrado ninguna marca.");
  });
});
