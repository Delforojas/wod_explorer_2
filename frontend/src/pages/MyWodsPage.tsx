import { useEffect, useState } from "react";
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
  const [error, setError] = useState<string | null>(null);

  // Cargar WODs y ejercicios

  useEffect(() => {
    let active = true;

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
    };
  }, []);

  // Obtener ejercicio

  function getExercise(exerciseId: number) {
    return exercises.find((exercise) => exercise.id === exerciseId);
  }

  // Consultar WOD

  async function handleSelectWod(id: number) {
    try {
      setError(null);

      const wod = await getWodById(id);
      setSelectedWod(wod);
    } catch {
      setError("No se pudo cargar el WOD");
    }
  }

  // Preparar edición

  function handleEditWod(wod: WodAggregateResponse) {
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
      name: editName,
      type: editType,
      timeCapSeconds: editTimeCapSeconds,
      rounds: editType === "FOR_TIME" ? editRounds : undefined,
      items: editItems,
    };

    try {
      const updatedWod = await updateWod(editingWod.id, request);

      setWods((currentWods) =>
        currentWods.map((wod) => (wod.id === updatedWod.id ? updatedWod : wod)),
      );

      setEditingWod(null);
      setEditItems([]);
    } catch {
      setError("No se pudo actualizar el WOD");
    }
  }

  // Eliminar WOD

  async function handleDeleteWod(id: number) {
    try {
      setError(null);

      await deleteWod(id);

      setWods((currentWods) => currentWods.filter((wod) => wod.id !== id));

      if (selectedWod?.id === id) {
        setSelectedWod(null);
      }
    } catch {
      setError("No se pudo eliminar el WOD");
    }
  }

  // Volver al listado

  function handleBack() {
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
