// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

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
  {
    id: 8,
    name: "Peso muerto",
    category: "WEIGHTLIFTING",
    measurementType: "WEIGHT",
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

function renderInteractiveExercisesList() {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated: false,
        username: null,
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
  afterEach(cleanup);

  it("does not expose exercise details to visitors", () => {
    const markup = renderExercisesList(false);

    expect(markup).not.toContain("Ver detalle");
    expect(markup).not.toContain("exercise-detail");
    expect(markup).not.toContain("/exercise-results/new");
    expect(markup).toContain("my-wod-row");
    expect(markup).not.toContain("resource-list");
    expect(markup).toContain("GYMNASTICS");
    expect(markup).toContain("REPS");
  });

  it("preserves result registration for authenticated users without details", () => {
    const markup = renderExercisesList(true);

    expect(markup).not.toContain("Ver detalle");
    expect(markup).not.toContain("exercise-detail");
    expect(markup).toContain('href="/exercise-results/new?exerciseId=7"');
    expect(markup).toContain("catalog-register-action");
    expect(markup).toContain("catalog-register-icon");
    expect(markup).toContain(">Registrar</span>");
    expect(markup).not.toContain("→");
    expect(markup).toContain("catalog-search-icon");
  });

  it("clears a search with Escape without moving focus", () => {
    renderInteractiveExercisesList();

    const search = screen.getByLabelText("Buscar ejercicios");
    search.focus();
    fireEvent.change(search, { target: { value: "sentadilla" } });

    expect(screen.getByText("Sentadilla")).toBeTruthy();
    expect(screen.queryByText("Peso muerto")).toBeNull();

    fireEvent.keyDown(search, { key: "Escape" });

    expect(search).toHaveProperty("value", "");
    expect(document.activeElement).toBe(search);
    expect(screen.getByText("Sentadilla")).toBeTruthy();
    expect(screen.getByText("Peso muerto")).toBeTruthy();

    fireEvent.keyDown(search, { key: "Escape" });

    expect(search).toHaveProperty("value", "");
    expect(document.activeElement).toBe(search);
  });

  it("ignores leading and trailing spaces in the search without altering the typed text", () => {
    renderInteractiveExercisesList();

    const search = screen.getByLabelText("Buscar ejercicios");

    fireEvent.change(search, { target: { value: "  sentadilla  " } });

    expect(search).toHaveProperty("value", "  sentadilla  ");
    expect(screen.getByText("Sentadilla")).toBeTruthy();
    expect(screen.queryByText("Peso muerto")).toBeNull();
  });

  it("treats a search made only of spaces as an empty search", () => {
    renderInteractiveExercisesList();

    const search = screen.getByLabelText("Buscar ejercicios");

    fireEvent.change(search, { target: { value: "   " } });

    expect(search).toHaveProperty("value", "   ");
    expect(screen.getByText("Sentadilla")).toBeTruthy();
    expect(screen.getByText("Peso muerto")).toBeTruthy();
  });
});
