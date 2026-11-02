import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { deleteWod, getMyWods, getWodById, updateWod } from "../api/wodsApi";

import { getExercises } from "../api/exercisesApi";

import type { ExerciseResponse } from "../types/Exercise";

import type {
  WodAggregateResponse,
  WodCompositionItemRequest,
  WodDefinitionRequest,
  WodType,
} from "../types/Wod";

import MyWodsView from "../views/my-wods/MyWodsView";
import { isLatestRequest } from "../utils/asyncRequest";
import { createSubmissionGuard } from "../utils/submissionGuard";
import { validateWodDefinition } from "../utils/wodDefinitionValidation";

function MyWodsPage() {
  const [wods, setWods] = useState<WodAggregateResponse[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);

  const [selectedWod, setSelectedWod] = useState<WodAggregateResponse | null>(
    null,
  );

  const [editingWod, setEditingWod] = useState<WodAggregateResponse | null>(
    null,
  );

  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<WodType>("FOR_TIME");

  const [editRounds, setEditRounds] = useState<number | undefined>();
  const [editTimeCapSeconds, setEditTimeCapSeconds] = useState<
    number | undefined
  >();

  const [editItems, setEditItems] = useState<WodCompositionItemRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [submitGuard] = useState(createSubmissionGuard);
  const [deleteGuard] = useState(createSubmissionGuard);
  const [error, setError] = useState<string | null>(null);
  const selectionRequest = useRef(0);
  const mounted = useRef(true);

  // Cargar WODs y ejercicios

  useEffect(() => {
    let active = true;
    mounted.current = true;

    Promise.all([getMyWods(), getExercises()])
      .then(([wodsData, exercisesData]) => {
        if (!active) return;

        setWods(wodsData);
        setExercises(exercisesData);
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar los datos");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      mounted.current = false;
    };
  }, []);

  // Obtener ejercicio

  function getExercise(exerciseId: number) {
    return exercises.find((exercise) => exercise.id === exerciseId);
  }

  // Consultar WOD

  async function handleSelectWod(id: number) {
    const requestId = ++selectionRequest.current;

    try {
      setError(null);

      const wod = await getWodById(id);

      if (!mounted.current || !isLatestRequest(requestId, selectionRequest.current)) {
        return;
      }

      setSelectedWod(wod);
    } catch {
      if (mounted.current && isLatestRequest(requestId, selectionRequest.current)) {
        setError("No se pudo cargar el WOD");
      }
    }
  }

  // Preparar edición

  function handleEditWod(wod: WodAggregateResponse) {
    selectionRequest.current += 1;
    setSelectedWod(null);
    setEditingWod(wod);

    setEditName(wod.name);
    setEditType(wod.version.type);
    setEditRounds(wod.version.rounds ?? undefined);
    setEditTimeCapSeconds(wod.version.timeCapSeconds ?? undefined);

    setEditItems(
      wod.composition.map((item) => ({
        exerciseId: item.exerciseId,
        reps: item.reps ?? undefined,
        weightKg: item.weightKg ?? undefined,
        distanceM: item.distanceM ?? undefined,
        durationSeconds: item.durationSeconds ?? undefined,
      })),
    );
  }

  function handleCancelEdit() {
    selectionRequest.current += 1;
    setEditingWod(null);
    setEditItems([]);
  }

  function handleEditTypeChange(newType: WodType) {
    setEditType(newType);

    if (newType !== "FOR_TIME") {
      setEditRounds(undefined);
    }
  }

  // Modificar ejercicios del WOD

  function handleEditExerciseChange(index: number, exerciseId: number) {
    setEditItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { exerciseId } : item,
      ),
    );
  }

  function handleEditRepsChange(index: number, reps: number | undefined) {
    setEditItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, reps } : item,
      ),
    );
  }

  function handleEditWeightChange(index: number, weightKg: number | undefined) {
    setEditItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, weightKg } : item,
      ),
    );
  }

  function handleEditDistanceChange(
    index: number,
    distanceM: number | undefined,
  ) {
    setEditItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, distanceM } : item,
      ),
    );
  }

  function handleEditDurationChange(
    index: number,
    durationSeconds: number | undefined,
  ) {
    setEditItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, durationSeconds } : item,
      ),
    );
  }

  function handleAddEditExercise() {
    if (exercises.length === 0) {
      return;
    }

    setEditItems((currentItems) => [
      ...currentItems,
      { exerciseId: exercises[0].id },
    ]);
  }

  function handleRemoveEditExercise(index: number) {
    setEditItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  // Guardar cambios

  async function handleUpdateWod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingWod) {
      return;
    }

    setError(null);

    const request: WodDefinitionRequest = {
      name: editName.trim(),
      type: editType,
      timeCapSeconds: editTimeCapSeconds,
      rounds: editType === "FOR_TIME" ? editRounds : undefined,
      items: editItems,
    };

    const validationErrors = validateWodDefinition(request, exercises);

    if (validationErrors.length > 0) {
      setError(validationErrors.map(({ message }) => message).join(" "));
      return;
    }

    if (!submitGuard.tryAcquire()) {
      return;
    }

    try {
      setSubmitting(true);

      const updatedWod = await updateWod(editingWod.id, request);

      setWods((currentWods) =>
        currentWods.map((wod) => (wod.id === updatedWod.id ? updatedWod : wod)),
      );

      setEditingWod(null);
      setEditItems([]);
    } catch {
      setError("No se pudo actualizar el WOD");
    } finally {
      submitGuard.release();
      setSubmitting(false);
    }
  }

  // Eliminar WOD

  async function handleDeleteWod(id: number) {
    if (deletingId !== null) {
      return;
    }

    if (!deleteGuard.tryAcquire()) {
      return;
    }

    if (!window.confirm("¿Quieres eliminar este WOD?")) {
      deleteGuard.release();
      return;
    }

    try {
      setError(null);
      setDeletingId(id);

      await deleteWod(id);

      setWods((currentWods) => currentWods.filter((wod) => wod.id !== id));

      if (selectedWod?.id === id) {
        setSelectedWod(null);
      }
    } catch {
      setError("No se pudo eliminar el WOD");
    } finally {
      deleteGuard.release();
      setDeletingId(null);
    }
  }

  // Volver al listado

  function handleBack() {
    selectionRequest.current += 1;
    setSelectedWod(null);
  }

  return (
    <MyWodsView
      wods={wods}
      exercises={exercises}
      selectedWod={selectedWod}
      editingWod={editingWod}
      editName={editName}
      editType={editType}
      editRounds={editRounds}
      editTimeCapSeconds={editTimeCapSeconds}
      editItems={editItems}
      loading={loading}
      submitting={submitting}
      deletingId={deletingId}
      error={error}
      getExercise={getExercise}
      onSelectWod={handleSelectWod}
      onEditWod={handleEditWod}
      onDeleteWod={handleDeleteWod}
      onCancelEdit={handleCancelEdit}
      onEditNameChange={setEditName}
      onEditTypeChange={handleEditTypeChange}
      onEditRoundsChange={setEditRounds}
      onEditTimeCapChange={setEditTimeCapSeconds}
      onEditExerciseChange={handleEditExerciseChange}
      onEditRepsChange={handleEditRepsChange}
      onEditWeightChange={handleEditWeightChange}
      onEditDistanceChange={handleEditDistanceChange}
      onEditDurationChange={handleEditDurationChange}
      onAddEditExercise={handleAddEditExercise}
      onRemoveEditExercise={handleRemoveEditExercise}
      onUpdateWod={handleUpdateWod}
      onBack={handleBack}
    />
  );
}

export default MyWodsPage;
