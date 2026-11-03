import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { WodResultResponse } from "../../types/WodResult";
import type { WodAggregateResponse } from "../../types/Wod";
import HomeView from "./HomeView";
import type { HomeViewProps } from "./HomeView.Types";
import {
  getFeaturedWods,
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

function createWod(
  id: number,
  name: string,
  category: WodAggregateResponse["category"],
  origin: WodAggregateResponse["origin"] = "GENERIC",
): WodAggregateResponse {
  return {
    id,
    ownerId: null,
    name,
    origin,
    category,
    createdAt: "2026-01-01T00:00:00Z",
    version: {
      id,
      wodId: id,
      wodName: name,
      versionNumber: 1,
      type: "FOR_TIME",
      timeCapSeconds: 900,
      rounds: null,
      createdAt: "2026-01-01T00:00:00Z",
    },
    composition: [],
  };
}

const authenticatedProps: HomeViewProps = {
  isAuthenticated: true,
  username: "Rogue",
  activityStatus: "success",
  activityResults: [createResult(1)],
  activityError: null,
  onRetry: () => undefined,
  featuredStatus: "success",
  featuredWods: [],
  featuredError: null,
  onRetryFeatured: () => undefined,
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

  it("keeps discovery, registration and exercise actions public for guests", () => {
    const markup = renderHome({
      ...authenticatedProps,
      isAuthenticated: false,
      activityStatus: "idle",
      activityResults: [],
      featuredWods: [
        createWod(1, "Fran", "CROSSTRAINING"),
        createWod(2, "Engine 8", "HYBRID"),
      ],
    });

    expect(markup).toContain("Explorar WODs");
    expect(markup).toContain("CATÁLOGO DE EJERCICIOS");
    expect(markup).toContain("Crear cuenta");
    expect(markup).toContain("CROSSTRAINING");
    expect(markup).toContain("HYBRID");
    expect(markup).toContain('href="/wods?category=CROSSTRAINING"');
    expect(markup).toContain('href="/wods?category=HYBRID"');
    expect(markup).toContain('href="/wods?wodId=1"');
    expect(markup).toContain("Fran");
    expect(markup).not.toContain("Registrar resultado de WOD");
    expect(markup).not.toContain("Registrar resultado de ejercicio");
    expect(markup).not.toContain("Benchmarks");
  });

  it("renders authenticated shortcuts and recent activity", () => {
    const markup = renderHome(authenticatedProps);

    expect(markup).toContain("Hola, <span>Rogue</span>");
    expect(markup).toContain("Registrar resultado de WOD");
    expect(markup).toContain('href="/my-wod-results/new"');
    expect(markup).toContain("Registrar resultado de ejercicio");
    expect(markup).toContain('href="/exercise-results/new"');
    expect(markup).toContain("Mis WODs");
    expect(markup).toContain("Benchmarks");
    expect(markup).toContain('href="/my-exercise-results"');
    expect(markup).toContain("Crear WOD personal");
    expect(markup).toContain("Tu siguiente movimiento");
    expect(markup).toContain("Elige tu reto de hoy");
    expect(markup).toContain('href="/wods?category=CROSSTRAINING"');
    expect(markup).toContain('href="/wods?category=HYBRID"');
    expect(markup).toContain("Actividad reciente");
    expect(markup).toContain("home-activity-kind");
    expect(markup).toContain(">WOD</span>");
    expect(markup).toContain("WOD 1");
    expect(markup).not.toContain("Crear cuenta");
  });

  it("wraps long authenticated display names without changing the guest home", () => {
    const markup = renderHome({
      ...authenticatedProps,
      username: "usuario-de-pruebas-con-un-nombre-muy-largo",
    });

    expect(markup).toContain("usuario-de-pruebas-con-un-nombre-muy-largo");
    expect(markup).toContain("home-dashboard-hero-copy");
    expect(markup).not.toContain("Crear cuenta");
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

  it("selects public WODs across categories and renders featured states", () => {
    const featured = getFeaturedWods([
      createWod(1, "Fran", "CROSSTRAINING"),
      createWod(2, "Engine 8", "HYBRID"),
      createWod(3, "Privado", "CROSSTRAINING", "PERSONAL"),
      createWod(4, "Cindy", "CROSSTRAINING"),
    ]);
    const loadingMarkup = renderHome({
      ...authenticatedProps,
      isAuthenticated: false,
      activityStatus: "idle",
      activityResults: [],
      featuredStatus: "loading",
    });
    const errorMarkup = renderHome({
      ...authenticatedProps,
      isAuthenticated: false,
      activityStatus: "idle",
      activityResults: [],
      featuredStatus: "error",
      featuredError: "No se pudo cargar el catálogo.",
    });
    const emptyMarkup = renderHome({
      ...authenticatedProps,
      isAuthenticated: false,
      activityStatus: "idle",
      activityResults: [],
      featuredWods: [],
    });

    expect(featured.map((wod) => wod.id)).toEqual([1, 2, 4]);
    expect(loadingMarkup).toContain("Cargando WODs destacados");
    expect(errorMarkup).toContain("No se pudo cargar el catálogo.");
    expect(errorMarkup).toContain("Reintentar");
    expect(emptyMarkup).toContain("Aún no hay WODs públicos disponibles");
  });
});
