import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

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

function renderWodsList(isAuthenticated: boolean) {
  return renderToStaticMarkup(
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username: isAuthenticated ? "Rogue" : null,
        signIn: () => undefined,
        signOut: () => undefined,
      }}
    >
      <MemoryRouter>
        <WodsList wods={wods} onSelectWod={() => undefined} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("WodsList", () => {
  it("keeps public browsing available without exposing registration", () => {
    const markup = renderWodsList(false);

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
    expect(markup.indexOf("For Time")).toBeLessThan(markup.indexOf("15 min"));
    expect(markup.indexOf("15 min")).toBeLessThan(markup.indexOf("CROSSTRAINING"));
    expect(markup.indexOf("AMRAP")).toBeLessThan(markup.indexOf("20 min"));
    expect(markup.indexOf("20 min")).toBeLessThan(markup.indexOf("HYBRID"));
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
});
