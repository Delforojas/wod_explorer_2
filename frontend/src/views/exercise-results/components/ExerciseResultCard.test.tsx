import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ExerciseResultResponse } from "../../../types/ExerciseResult";
import ExerciseResultCard from "./ExerciseResultCard";

const result: ExerciseResultResponse = {
  id: 1,
  exerciseId: 112,
  reps: null,
  weightKg: null,
  distanceM: 5000,
  durationSeconds: 1472,
  performedAt: "2026-01-01T10:00:00Z",
  createdAt: null,
};

function renderCard(isPersonalBest: boolean): string {
  return renderToStaticMarkup(
    <ExerciseResultCard
      result={result}
      exerciseName="Run"
      isPersonalBest={isPersonalBest}
    />,
  );
}

describe("exercise result personal-best badge", () => {
  it("renders the accessible trophy badge for backend-selected personal bests", () => {
    const markup = renderCard(true);

    expect(markup).toContain('aria-label="Récord personal"');
    expect(markup).toContain('title="Récord personal"');
    expect(markup).toContain(">PR</span>");
    expect(markup).toContain("exercise-result-personal-best");
    expect(markup).toContain("exercise-result-card");
    expect(markup).toContain("exercise-result-card-header");
  });

  it("does not render the badge for regular results", () => {
    const markup = renderCard(false);

    expect(markup).not.toContain("aria-label=\"Récord personal\"");
    expect(markup).not.toContain("exercise-result-personal-best");
    expect(markup).toContain("exercise-result-card-header");
  });
});
