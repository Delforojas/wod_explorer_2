import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { WodAggregateResponse } from "../../types/Wod";
import MyWodsView from "./MyWodsView";
import type { MyWodsViewProps } from "./MyWodsView.Types";
import MyWodsList from "./components/MyWodsList";

const wod: WodAggregateResponse = {
  id: 7,
  ownerId: 4,
  name: "Morning Engine",
  origin: "PERSONAL",
  createdAt: "2026-11-02T10:00:00Z",
  version: {
    id: 11,
    wodId: 7,
    wodName: "Morning Engine",
    versionNumber: 1,
    type: "FOR_TIME",
    timeCapSeconds: 300,
    rounds: null,
    createdAt: "2026-11-02T10:00:00Z",
  },
  composition: [],
};

function renderList(wods: WodAggregateResponse[]): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <MyWodsList
        wods={wods}
        deletingId={null}
        onSelectWod={() => undefined}
        onEditWod={() => undefined}
        onDeleteWod={() => undefined}
      />
    </MemoryRouter>,
  );
}

function renderView(overrides: Partial<MyWodsViewProps> = {}): string {
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

describe("my WODs presentation", () => {
  it("renders the lightweight list, metadata, routes, and accessible actions", () => {
    const markup = renderList([wod]);

    expect(markup).toContain("Mis WODs");
    expect(markup).toContain("Morning Engine");
    expect(markup).toContain("FOR_TIME");
    expect(markup).toContain("5 min");
    expect(markup).toContain('href="/my-wod-results"');
    expect(markup).toContain('href="/create-wod"');
    expect(markup).toContain('aria-label="Acciones para Morning Engine"');
    expect(markup).toContain('aria-label="Ver WOD Morning Engine"');
    expect(markup).toContain('aria-label="Editar Morning Engine"');
    expect(markup).toContain('aria-label="Eliminar Morning Engine"');
    expect(markup).toContain("delete-icon-button");
    expect(markup).toContain('data-variant="destructive"');
    expect(markup).toContain('data-size="icon"');
    expect(markup).not.toContain(">Eliminar</button>");
    expect(markup).toContain("my-wod-row");
    expect(markup).not.toContain("my-wods-button");
  });

  it("renders the empty state without inventing WOD content", () => {
    const markup = renderList([]);

    expect(markup).toContain("0 entrenamientos personales");
    expect(markup).toContain("Todavía no has creado ningún WOD.");
    expect(markup).toContain('role="status"');
    expect(markup).not.toContain("my-wod-row");
  });

  it("preserves loading and error states", () => {
    const loadingMarkup = renderView({ loading: true });
    const errorMarkup = renderView({ error: "No se pudieron cargar los datos" });

    expect(loadingMarkup).toContain("Cargando tus WODs...");
    expect(loadingMarkup).toContain('role="status"');
    expect(errorMarkup).toContain("No se pudieron cargar los datos");
    expect(errorMarkup).toContain('role="alert"');
  });
});
