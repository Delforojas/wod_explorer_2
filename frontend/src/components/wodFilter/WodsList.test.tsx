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
    expect(markup).toContain("15 min");
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
