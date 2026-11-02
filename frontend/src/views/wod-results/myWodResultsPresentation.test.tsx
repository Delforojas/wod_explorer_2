import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { WodResultResponse } from "../../types/WodResult";
import MyWodResultsView from "./MyWodResultsView";
import type { MyWodResultsViewProps } from "./MyWodResultsView.Types";

function createResult(
  overrides: Partial<WodResultResponse> = {},
): WodResultResponse {
  return {
    id: 1,
    wodId: 10,
    wodName: "Fran",
    origin: "PERSONAL",
    wodVersionId: 23,
    type: "FOR_TIME",
    performedAt: "2026-11-02T10:00:00Z",
    completed: true,
    timeSeconds: 315,
    progressRounds: null,
    progressItemId: null,
    progressReps: null,
    progressDistanceM: null,
    progressDurationSeconds: null,
    amrapRounds: null,
    amrapExtraReps: null,
    createdAt: "2026-11-02T10:00:00Z",
    ...overrides,
  };
}

function renderView(overrides: Partial<MyWodResultsViewProps> = {}): string {
  const props: MyWodResultsViewProps = {
    results: [createResult()],
    loading: false,
    error: null,
    deletingId: null,
    onDelete: () => undefined,
    ...overrides,
  };

  return renderToStaticMarkup(
    <MemoryRouter>
      <MyWodResultsView {...props} />
    </MemoryRouter>,
  );
}

describe("my WOD results presentation", () => {
  it("renders the history CTA and lightweight result row", () => {
    const markup = renderView();

    expect(markup).toContain("WOD Results");
    expect(markup).toContain("SEGUIMIENTO PERSONAL");
    expect(markup).toContain(
      "Consulta tus resultados y sigue tu evolución en cada entrenamiento.",
    );
    expect(markup).toContain("+ Add Score");
    expect(markup).toContain('href="/my-wod-results/new"');
    expect(markup).not.toContain(">Resultados</a>");
    expect(markup).toContain("Fran");
    expect(markup).toContain("FOR TIME");
    expect(markup).toContain("Personal");
    expect(markup).toContain("Tiempo: 5:15");
    expect(markup).toContain('dateTime="2026-11-02T10:00:00Z"');
    expect(markup).not.toContain("Versión ID 23");
    expect(markup).toContain('aria-label="Eliminar resultado de Fran"');
    expect(markup).toContain("resource-row my-wod-result-row");
  });

  it("keeps AMRAP, EMOM, and incomplete result details", () => {
    const markup = renderView({
      results: [
        createResult({
          type: "AMRAP",
          origin: "GENERIC",
          completed: null,
          timeSeconds: null,
          amrapRounds: 8,
          amrapExtraReps: 4,
        }),
        createResult({
          id: 2,
          wodName: "Every Minute",
          type: "EMOM",
          completed: false,
          timeSeconds: null,
        }),
        createResult({
          id: 3,
          wodName: "Helen",
          completed: false,
          timeSeconds: null,
          progressRounds: 2,
          progressReps: 7,
          progressDistanceM: 400,
          progressDurationSeconds: 90,
        }),
      ],
    });

    expect(markup).toContain("AMRAP");
    expect(markup).toContain("8 rondas + 4 reps");
    expect(markup).toContain("EMOM");
    expect(markup).toContain("No completado");
    expect(markup).toContain("Rondas completadas: 2");
    expect(markup).toContain("Progreso: 7 reps");
    expect(markup).toContain("Progreso: 400 m");
    expect(markup).toContain("Progreso: 90 segundos");
  });

  it("preserves loading, error, empty, and deleting states", () => {
    const loadingMarkup = renderView({ loading: true });
    const errorMarkup = renderView({ error: "No se pudieron cargar los resultados" });
    const emptyMarkup = renderView({ results: [] });
    const deletingMarkup = renderView({ deletingId: 1 });

    expect(loadingMarkup).toContain("Cargando resultados de WODs...");
    expect(loadingMarkup).toContain('role="status"');
    expect(errorMarkup).toContain("No se pudieron cargar los resultados");
    expect(errorMarkup).toContain('role="alert"');
    expect(emptyMarkup).toContain("Todavía no has registrado ningún resultado de WOD.");
    expect(emptyMarkup).toContain('aria-live="polite"');
    expect(deletingMarkup).toContain("Eliminando...");
    expect(deletingMarkup).toContain("disabled");
  });
});
