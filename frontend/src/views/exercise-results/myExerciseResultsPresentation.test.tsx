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
    exerciseName: `Exercise ${exerciseId}`,
    measurementType: "REPS",
    reps: 10,
    weightKg: null,
    distanceM: null,
    durationSeconds: null,
    performedAt: "2026-01-01T10:00:00Z",
    createdAt: null,
  };
}

const exercises = [
  createExercise(10, "Back Squat"),
  createExercise(20, "Hang Squat Clean"),
];
const results = [createResult(1, 10)];

function renderView(
  overrides: Partial<MyExerciseResultsViewProps> = {},
): string {
  const props: MyExerciseResultsViewProps = {
    results,
    personalBests: results,
    exercises,
    mode: "all",
    resultsLoading: false,
    personalBestsLoading: false,
    resultsError: null,
    personalBestsError: null,
    exercisesError: null,
    deleteError: null,
    deletingId: null,
    onModeChange: () => undefined,
    onRetryResults: () => undefined,
    onRetryPersonalBests: () => undefined,
    onRetryExercises: () => undefined,
    onDelete: () => undefined,
    ...overrides,
  };

  return renderToStaticMarkup(
    <MemoryRouter>
      <MyExerciseResultsView {...props} />
    </MemoryRouter>,
  );
}

describe("my exercise results presentation", () => {
  it("renders the mode toggle, search input, and preserves registration", () => {
    const markup = renderView();

    expect(markup).toContain("<h1>Benchmarks</h1>");
    expect(markup).toContain("+ Add Score");
    expect(markup).toContain('aria-label="Secciones de Benchmarks"');
    expect(markup).toContain('aria-label="Modo de Benchmarks"');
    expect(markup).toContain("Buscar ejercicio");
    expect(markup).toContain('type="search"');
    expect(markup).toContain('placeholder="Buscar ejercicio..."');
    expect(markup).toContain("exercise-results-search-icon");
    expect(markup).toContain("All Scores");
    expect(markup).toContain("Personal Records");
    expect(markup).not.toContain(">Todas las marcas</button>");
    expect(markup).not.toContain(">Mejores marcas</button>");
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).not.toContain("<select");
    expect(markup).toContain('href="/exercise-results/new"');
    expect(markup).toContain('aria-label="Eliminar resultado de Back Squat"');
    expect(markup).not.toContain(">Eliminar</button>");
  });

  it("renders loading, error with recovery, and empty states", () => {
    const loadingMarkup = renderView({ resultsLoading: true });
    const errorMarkup = renderView({
      resultsError: "No se pudieron cargar tus marcas",
    });
    const emptyMarkup = renderView({ results: [] });

    expect(loadingMarkup).toContain("Cargando tus marcas...");
    expect(errorMarkup).toContain("No se pudieron cargar tus marcas");
    expect(errorMarkup).toContain("Reintentar");
    expect(emptyMarkup).toContain("Todavía no has registrado ninguna marca.");
  });

  it("keeps the personal-bests state independent from the history state", () => {
    const historyMarkup = renderView({
      resultsError: "No se pudieron cargar tus marcas",
      personalBestsError: null,
    });
    const personalBestsMarkup = renderView({
      mode: "best",
      resultsError: null,
      personalBestsError: "No se pudieron cargar tus mejores marcas",
    });

    expect(historyMarkup).toContain("No se pudieron cargar tus marcas");
    expect(historyMarkup).not.toContain("No se pudieron cargar tus mejores marcas");
    expect(personalBestsMarkup).toContain("No se pudieron cargar tus mejores marcas");
    expect(personalBestsMarkup).not.toContain("No se pudieron cargar tus marcas");
  });

  it("uses independent loading messages for each mode", () => {
    const historyMarkup = renderView({ resultsLoading: true });
    const personalBestsMarkup = renderView({
      mode: "best",
      personalBestsLoading: true,
    });

    expect(historyMarkup).toContain("Cargando tus marcas...");
    expect(personalBestsMarkup).toContain("Cargando tus mejores marcas...");
  });

  it("shows backend-selected personal bests in both modes", () => {
    const allMarkup = renderView({ results, personalBests: results });
    const bestMarkup = renderView({
      mode: "best",
      results: [],
      personalBests: results,
    });

    expect(allMarkup).toContain('aria-label="Récord personal"');
    expect(bestMarkup).toContain('aria-label="Récord personal"');
  });

  it("renders the same delete action in All Scores and Personal Records", () => {
    const allMarkup = renderView({ mode: "all" });
    const bestMarkup = renderView({ mode: "best" });

    expect(allMarkup).toContain('aria-label="Eliminar resultado de Back Squat"');
    expect(bestMarkup).toContain('aria-label="Eliminar resultado de Back Squat"');
    expect(allMarkup).toContain("delete-icon-button");
    expect(bestMarkup).toContain("delete-icon-button");
  });

  it("communicates a delete error without replacing the current list", () => {
    const markup = renderView({ deleteError: "No se pudo eliminar la marca" });

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("No se pudo eliminar la marca");
    expect(markup).toContain("Back Squat");
  });

  it("disables the result currently being deleted", () => {
    const markup = renderView({ deletingId: 1 });

    expect(markup).toContain('aria-label="Eliminando..."');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("disabled");
  });

  it("shows PR in the initial all-results mode without switching tabs", () => {
    const markup = renderView({
      mode: "all",
      results,
      personalBests: results,
    });

    expect(markup).toContain(">PR</span>");
    expect(markup).toContain('aria-label="Récord personal"');
  });

  it("exposes an empty state for a mode without personal bests", () => {
    const markup = renderView({ results, personalBests: [] });

    expect(markup).toContain("All Scores");
    expect(markup).toContain("Personal Records");
  });
});
