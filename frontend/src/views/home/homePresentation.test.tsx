import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { WodResultResponse } from "../../types/WodResult";
import HomeView from "./HomeView";
import type { HomeViewProps } from "./HomeView.Types";
import {
  getHomeDisplayName,
  getRecentWodResults,
} from "./homePresentation";

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

function renderHome(props: HomeViewProps): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <HomeView {...props} />
    </MemoryRouter>,
  );
}

const authenticatedProps: HomeViewProps = {
  isAuthenticated: true,
  username: "Rogue",
  activityStatus: "success",
  activityResults: [createResult(1)],
  activityError: null,
  onRetry: () => undefined,
};

describe("home presentation", () => {
  it("uses a safe display name fallback and limits recent activity", () => {
    expect(getHomeDisplayName(null)).toBe("atleta");
    expect(getHomeDisplayName("  ")).toBe("atleta");
    expect(getHomeDisplayName("  Rogue  ")).toBe("Rogue");
    expect(
      getRecentWodResults([
        createResult(1),
        createResult(2),
        createResult(3),
        createResult(4),
      ]),
    ).toHaveLength(3);
  });

  it("keeps the public landing actions for guests", () => {
    const markup = renderHome({
      ...authenticatedProps,
      isAuthenticated: false,
      activityStatus: "idle",
      activityResults: [],
    });

    expect(markup).toContain("Explorar WODs");
    expect(markup).toContain("Catálogo de ejercicios");
    expect(markup).toContain("Iniciar sesión");
    expect(markup).not.toContain("Registrar resultado de WOD");
  });

  it("renders authenticated shortcuts and recent activity", () => {
    const markup = renderHome(authenticatedProps);

    expect(markup).toContain("Hola, Rogue");
    expect(markup).toContain("Registrar resultado de WOD");
    expect(markup).toContain("Mis WODs");
    expect(markup).toContain("Crear WOD personal");
    expect(markup).toContain("Actividad reciente");
    expect(markup).toContain("WOD 1");
    expect(markup).not.toContain("Iniciar sesión");
  });

  it("renders empty, loading and retryable error states", () => {
    const emptyMarkup = renderHome({
      ...authenticatedProps,
      activityResults: [],
    });
    const loadingMarkup = renderHome({
      ...authenticatedProps,
      activityStatus: "loading",
      activityResults: [],
    });
    const errorMarkup = renderHome({
      ...authenticatedProps,
      activityStatus: "error",
      activityResults: [],
      activityError: "No se pudo cargar la actividad.",
    });

    expect(emptyMarkup).toContain("No hay resultados aún");
    expect(loadingMarkup).toContain("Cargando tu actividad");
    expect(errorMarkup).toContain("No se pudo cargar la actividad.");
    expect(errorMarkup).toContain("Reintentar");
  });
});
