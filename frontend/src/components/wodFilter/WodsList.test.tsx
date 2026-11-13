// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AuthContext } from "../../auth/sessionContext";
import type { WodAggregateResponse } from "../../types/Wod";
import WodsList from "./WodsList";

const wods: WodAggregateResponse[] = [
  {
    id: 12,
    ownerId: null,
    name: "Morning Engine",
    origin: "GENERIC",
    category: "CROSSTRAINING",
    createdAt: "2026-01-01T00:00:00Z",
    version: {
      id: 20,
      wodId: 12,
      wodName: "Morning Engine",
      versionNumber: 1,
      type: "FOR_TIME",
      timeCapSeconds: 900,
      rounds: null,
      createdAt: "2026-01-01T00:00:00Z",
    },
    composition: [],
  },
  {
    id: 13,
    ownerId: null,
    name: "Hybrid Circuit",
    origin: "GENERIC",
    category: "HYBRID",
    createdAt: "2026-01-01T00:00:00Z",
    version: {
      id: 21,
      wodId: 13,
      wodName: "Hybrid Circuit",
      versionNumber: 1,
      type: "AMRAP",
      timeCapSeconds: 1200,
      rounds: 4,
      createdAt: "2026-01-01T00:00:00Z",
    },
    composition: [],
  },
  {
    id: 14,
    ownerId: null,
    name: "Strength Builder",
    origin: "GENERIC",
    category: "STRENGTH",
    createdAt: "2026-01-01T00:00:00Z",
    version: {
      id: 22,
      wodId: 14,
      wodName: "Strength Builder",
      versionNumber: 1,
      type: "EMOM",
      timeCapSeconds: null,
      rounds: 5,
      createdAt: "2026-01-01T00:00:00Z",
    },
    composition: [],
  },
  {
    id: 15,
    ownerId: null,
    name: "Uncategorized Session",
    origin: "GENERIC",
    category: null,
    createdAt: "2026-01-01T00:00:00Z",
    version: {
      id: 23,
      wodId: 15,
      wodName: "Uncategorized Session",
      versionNumber: 1,
      type: "FOR_TIME",
      timeCapSeconds: null,
      rounds: null,
      createdAt: "2026-01-01T00:00:00Z",
    },
    composition: [],
  },
];

function renderWodsList(isAuthenticated: boolean, initialEntry = "/wods") {
  return renderToStaticMarkup(
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username: isAuthenticated ? "Rogue" : null,
        signIn: () => undefined,
        signOut: () => undefined,
      }}
    >
      <MemoryRouter initialEntries={[initialEntry]}>
        <WodsList wods={wods} onSelectWod={() => undefined} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

function renderInteractiveWodsList(initialEntry: string) {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated: false,
        username: null,
        signIn: () => undefined,
        signOut: () => undefined,
      }}
    >
      <MemoryRouter initialEntries={[initialEntry]}>
        <WodsList wods={wods} onSelectWod={() => undefined} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("WodsList", () => {
  afterEach(cleanup);

  it("keeps public browsing available without exposing registration", () => {
    const markup = renderWodsList(false);
    const morningEngineMarkup = markup.slice(markup.indexOf("Morning Engine"));
    const hybridCircuitMarkup = markup.slice(markup.indexOf("Hybrid Circuit"));

    expect(markup).toContain("Morning Engine");
    expect(markup).toContain("For Time");
    expect(markup).toContain("CROSSTRAINING");
    expect(markup).toContain("wod-category-badge--crosstraining");
    expect(markup).toContain("HYBRID");
    expect(markup).toContain("wod-category-badge--hybrid");
    expect(markup).toContain("STRENGTH");
    expect(markup).toContain("wod-category-badge--neutral");
    expect(markup).toContain("SIN CATEGORÍA");
    expect(markup).toContain("15 min");
    expect(morningEngineMarkup.indexOf("For Time")).toBeLessThan(
      morningEngineMarkup.indexOf("15 min"),
    );
    expect(morningEngineMarkup.indexOf("15 min")).toBeLessThan(
      morningEngineMarkup.indexOf("CROSSTRAINING"),
    );
    expect(hybridCircuitMarkup.indexOf("AMRAP")).toBeLessThan(
      hybridCircuitMarkup.indexOf("20 min"),
    );
    expect(hybridCircuitMarkup.indexOf("20 min")).toBeLessThan(
      hybridCircuitMarkup.indexOf("HYBRID"),
    );
    expect(markup).toContain("Ver WOD");
    expect(markup).toContain("my-wod-row");
    expect(markup).not.toContain("resource-list");
    expect(markup).not.toContain("/my-wod-results/new");
  });

  it("preserves authenticated WOD registration", () => {
    const markup = renderWodsList(true);

    expect(markup).toContain('href="/my-wod-results/new?wodId=12"');
    expect(markup).toContain("catalog-register-action");
    expect(markup).toContain("catalog-register-icon");
    expect(markup).toContain(">Registrar</span>");
    expect(markup).not.toContain("→");
    expect(markup).toContain("catalog-search-icon");
  });

  it("reflects category filters received from Home in the selected tab and list", () => {
    const markup = renderWodsList(false, "/wods?category=HYBRID");

    expect(markup).toContain('aria-label="Filtrar WODs por categoría"');
    expect(markup).toContain('aria-pressed="false">Todos</button>');
    expect(markup).toContain('aria-pressed="true">HYBRID</button>');
    expect(markup).toContain("Hybrid Circuit");
    expect(markup).not.toContain("Morning Engine");
    expect(markup).toContain("1 de 4 WODs");
  });

  it("uses Todos when the category URL parameter is invalid", () => {
    const markup = renderWodsList(false, "/wods?category=STRENGTH");

    expect(markup).toContain('aria-pressed="true">Todos</button>');
    expect(markup).toContain("4 WODs disponibles");
    expect(markup).toContain("Strength Builder");
  });

  it("shows a singular count when exactly one WOD is available", () => {
    const markup = renderToStaticMarkup(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          username: null,
          signIn: () => undefined,
          signOut: () => undefined,
        }}
      >
        <MemoryRouter initialEntries={["/wods"]}>
          <WodsList wods={[wods[0]]} onSelectWod={() => undefined} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("1 WOD disponible");
    expect(markup).not.toContain("1 WODs");
  });

  it("shows a zero count without hiding the empty state when a search has no matches", () => {
    const markup = renderToStaticMarkup(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          username: null,
          signIn: () => undefined,
          signOut: () => undefined,
        }}
      >
        <MemoryRouter initialEntries={["/wods?category=HYBRID"]}>
          <WodsList wods={[wods[0]]} onSelectWod={() => undefined} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain("0 de 1 WOD");
    expect(markup).toContain("No se encontraron WODs");
  });

  it("exposes the counter as an accessible status region", () => {
    const markup = renderWodsList(false);

    expect(markup).toContain(
      '<p class="wod-count" role="status" aria-live="polite">',
    );
    expect(markup).toContain("4 WODs disponibles");
  });

  it("keeps the counter's status region separate from the empty state region when there are no matches", () => {
    const markup = renderToStaticMarkup(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          username: null,
          signIn: () => undefined,
          signOut: () => undefined,
        }}
      >
        <MemoryRouter initialEntries={["/wods?category=HYBRID"]}>
          <WodsList wods={[wods[0]]} onSelectWod={() => undefined} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(markup).toContain(
      '<p class="wod-count" role="status" aria-live="polite">0 de 1 WOD</p>',
    );
    expect(markup).toContain(
      '<div class="wod-empty-state" role="status" aria-live="polite">',
    );
  });

  it("clears a search with Escape while preserving the selected category and focus", () => {
    renderInteractiveWodsList("/wods?category=CROSSTRAINING");

    const search = screen.getByLabelText("Buscar WODs");
    search.focus();
    fireEvent.change(search, { target: { value: "morning" } });

    expect(screen.getByText("Morning Engine")).toBeTruthy();
    expect(screen.queryByText("Hybrid Circuit")).toBeNull();

    fireEvent.keyDown(search, { key: "Escape" });

    expect(search).toHaveProperty("value", "");
    expect(document.activeElement).toBe(search);
    expect(
      screen
        .getByRole("button", { name: "CROSSTRAINING" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByText("Morning Engine")).toBeTruthy();
    expect(screen.queryByText("Hybrid Circuit")).toBeNull();

    fireEvent.keyDown(search, { key: "Escape" });

    expect(search).toHaveProperty("value", "");
    expect(document.activeElement).toBe(search);
  });

  it("ignores leading and trailing spaces in the search without altering the typed text", () => {
    renderInteractiveWodsList("/wods?category=CROSSTRAINING");

    const search = screen.getByLabelText("Buscar WODs");

    fireEvent.change(search, { target: { value: "  morning  " } });

    expect(search).toHaveProperty("value", "  morning  ");
    expect(
      screen
        .getByRole("button", { name: "CROSSTRAINING" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByText("Morning Engine")).toBeTruthy();
    expect(screen.queryByText("Hybrid Circuit")).toBeNull();
    expect(screen.getByText("1 de 4 WODs")).toBeTruthy();
  });

  it("treats a search made only of spaces as an empty search", () => {
    renderInteractiveWodsList("/wods?category=CROSSTRAINING");

    const search = screen.getByLabelText("Buscar WODs");

    fireEvent.change(search, { target: { value: "   " } });

    expect(search).toHaveProperty("value", "   ");
    expect(screen.getByText("Morning Engine")).toBeTruthy();
    expect(screen.getByText("1 de 4 WODs")).toBeTruthy();
  });
});
