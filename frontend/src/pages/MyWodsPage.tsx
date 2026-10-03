import { useEffect, useState } from "react";

import { deleteWod, getMyWods, getWodById, updateWod } from "../api/wodsApi";
import { getExercises } from "../api/exercisesApi";
import { createWodResult } from "../api/wodsResultsApi";

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

  const [registeringResult, setRegisteringResult] = useState(false);

  const [resultPerformedAt, setResultPerformedAt] = useState("");
  const [amrapRounds, setAmrapRounds] = useState<number | undefined>();
  const [amrapExtraReps, setAmrapExtraReps] = useState<number | undefined>();
  const [resultSuccess, setResultSuccess] = useState<string | null>(null);

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

  useEffect(() => {
    Promise.all([getMyWods(), getExercises()])
      .then(([wodsData, exercisesData]) => {
        setWods(wodsData);
        setExercises(exercisesData);
      })
      .catch(() => {
        setError("No se pudieron cargar los datos");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function getExercise(exerciseId: number) {
    return exercises.find((exercise) => exercise.id === exerciseId);
  }

  async function handleSelectWod(id: number) {
    try {
      setError(null);
      setResultSuccess(null);
      setRegisteringResult(false);

      const wod = await getWodById(id);

      setSelectedWod(wod);
    } catch {
      setError("No se pudo cargar el WOD");
    }
  }

  function handleEditWod(wod: WodAggregateResponse) {
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

  function handleEditExerciseChange(index: number, exerciseId: number) {
    const newItems = [...editItems];

    newItems[index] = {
      exerciseId,
    };

    setEditItems(newItems);
  }

  function handleEditRepsChange(index: number, reps: number | undefined) {
    const newItems = [...editItems];

    newItems[index] = {
      ...newItems[index],
      reps,
    };

    setEditItems(newItems);
  }

  function handleEditWeightChange(index: number, weightKg: number | undefined) {
    const newItems = [...editItems];

    newItems[index] = {
      ...newItems[index],
      weightKg,
    };

    setEditItems(newItems);
  }

  function handleEditDistanceChange(
    index: number,
    distanceM: number | undefined,
  ) {
    const newItems = [...editItems];

    newItems[index] = {
      ...newItems[index],
      distanceM,
    };

    setEditItems(newItems);
  }

  function handleEditDurationChange(
    index: number,
    durationSeconds: number | undefined,
  ) {
    const newItems = [...editItems];

    newItems[index] = {
      ...newItems[index],
      durationSeconds,
    };

    setEditItems(newItems);
  }

  function handleAddEditExercise() {
    if (exercises.length === 0) {
      return;
    }

    setEditItems([
      ...editItems,
      {
        exerciseId: exercises[0].id,
      },
    ]);
  }

  function handleRemoveEditExercise(index: number) {
    setEditItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleUpdateWod(event: React.FormEvent<HTMLFormElement>) {
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

  async function handleDeleteWod(id: number) {
    try {
      setError(null);

      await deleteWod(id);

      setWods((currentWods) => currentWods.filter((wod) => wod.id !== id));
    } catch {
      setError("No se pudo eliminar el WOD");
    }
  }

  async function handleCreateAmrapResult(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedWod) {
      return;
    }

    if (amrapRounds === undefined || amrapExtraReps === undefined) {
      setError("Debes indicar las rondas y las repeticiones extra");
      return;
    }

    try {
      setError(null);
      setResultSuccess(null);

      await createWodResult({
        wodVersionId: selectedWod.version.id,
        performedAt: resultPerformedAt,
        amrapRounds,
        amrapExtraReps,
      });

      setResultSuccess("Resultado guardado correctamente");
      setRegisteringResult(false);

      setResultPerformedAt("");
      setAmrapRounds(undefined);
      setAmrapExtraReps(undefined);
    } catch {
      setError("No se pudo guardar el resultado");
    }
  }

  function handleStartRegisterResult() {
    setResultSuccess(null);
    setRegisteringResult(true);
  }

  function handleBack() {
    setRegisteringResult(false);
    setResultSuccess(null);
    setSelectedWod(null);
  }

  return (
    <MyWodsView
      wods={wods}
      exercises={exercises}
      selectedWod={selectedWod}
      registeringResult={registeringResult}
      resultPerformedAt={resultPerformedAt}
      amrapRounds={amrapRounds}
      amrapExtraReps={amrapExtraReps}
      resultSuccess={resultSuccess}
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
      onStartRegisterResult={handleStartRegisterResult}
      onCancelRegisterResult={() => setRegisteringResult(false)}
      onResultPerformedAtChange={setResultPerformedAt}
      onAmrapRoundsChange={setAmrapRounds}
      onAmrapExtraRepsChange={setAmrapExtraReps}
      onCreateAmrapResult={handleCreateAmrapResult}
    />
  );
}

export default MyWodsPage;
