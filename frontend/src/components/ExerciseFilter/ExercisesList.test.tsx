import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AuthContext } from "../../auth/sessionContext";
import type { ExerciseResponse } from "../../types/Exercise";
import ExercisesList from "./ExercisesList";

const exercises: ExerciseResponse[] = [
  {
    id: 7,
    name: "Sentadilla",
    category: "GYMNASTICS",
    measurementType: "REPS",
    active: true,
  },
];

function renderExercisesList(isAuthenticated: boolean) {
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
        <ExercisesList exercises={exercises} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ExercisesList", () => {
  it("does not expose exercise details to visitors", () => {
    const markup = renderExercisesList(false);

    expect(markup).not.toContain("Ver detalle");
    expect(markup).not.toContain("exercise-detail");
    expect(markup).not.toContain("/exercise-results/new");
    expect(markup).toContain("resource-row");
    expect(markup).toContain("GYMNASTICS");
    expect(markup).toContain("REPS");
  });

  it("preserves result registration for authenticated users without details", () => {
    const markup = renderExercisesList(true);

    expect(markup).not.toContain("Ver detalle");
    expect(markup).not.toContain("exercise-detail");
    expect(markup).toContain('href="/exercise-results/new?exerciseId=7"');
    expect(markup).toContain("Registrar resultado");
    expect(markup).toContain("catalog-search-icon");
  });
});
