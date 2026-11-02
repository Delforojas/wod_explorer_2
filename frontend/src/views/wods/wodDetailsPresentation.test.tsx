import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { MyWodsViewProps } from "../my-wods/MyWodsView.Types";
import MyWodsView from "../my-wods/MyWodsView";
import WodsView from "./WodsView";
import type { WodsViewProps } from "./WodsView.Types";

function renderPublicView(overrides: Partial<WodsViewProps> = {}): string {
  const props: WodsViewProps = {
    wods: [],
    selectedWod: null,
    loading: false,
    error: null,
    onSelectWod: () => undefined,
    onBack: () => undefined,
    ...overrides,
  };

  return renderToStaticMarkup(
    <MemoryRouter>
      <WodsView {...props} />
    </MemoryRouter>,
  );
}

function renderPersonalView(overrides: Partial<MyWodsViewProps> = {}): string {
  const props: MyWodsViewProps = {
    wods: [],
    exercises: [],
    selectedWod: null,
    editingWod: null,
    editName: "",
    editType: "FOR_TIME",
    editRounds: undefined,
    editTimeCapSeconds: undefined,
    editItems: [],
    loading: false,
    submitting: false,
    deletingId: null,
    error: null,
    getExercise: () => undefined,
    onSelectWod: () => undefined,
    onEditWod: () => undefined,
    onDeleteWod: () => undefined,
    onCancelEdit: () => undefined,
    onEditNameChange: () => undefined,
    onEditTypeChange: () => undefined,
    onEditRoundsChange: () => undefined,
    onEditTimeCapChange: () => undefined,
    onEditExerciseChange: () => undefined,
    onEditRepsChange: () => undefined,
    onEditWeightChange: () => undefined,
    onEditDistanceChange: () => undefined,
    onEditDurationChange: () => undefined,
    onAddEditExercise: () => undefined,
    onRemoveEditExercise: () => undefined,
    onUpdateWod: () => undefined,
    onBack: () => undefined,
    ...overrides,
  };

  return renderToStaticMarkup(
    <MemoryRouter>
      <MyWodsView {...props} />
    </MemoryRouter>,
  );
}

describe("WOD detail states", () => {
  it("keeps public loading and error semantics", () => {
    const loadingMarkup = renderPublicView({ loading: true });
    const errorMarkup = renderPublicView({ error: "No se pudieron cargar los WODs" });

    expect(loadingMarkup).toContain("Cargando WODs...");
    expect(loadingMarkup).toContain('role="status"');
    expect(errorMarkup).toContain("No se pudieron cargar los WODs");
    expect(errorMarkup).toContain('role="alert"');
  });

  it("keeps personal loading and error semantics", () => {
    const loadingMarkup = renderPersonalView({ loading: true });
    const errorMarkup = renderPersonalView({ error: "No se pudieron cargar los datos" });

    expect(loadingMarkup).toContain("Cargando tus WODs...");
    expect(loadingMarkup).toContain('role="status"');
    expect(errorMarkup).toContain("No se pudieron cargar los datos");
    expect(errorMarkup).toContain('role="alert"');
  });
});
