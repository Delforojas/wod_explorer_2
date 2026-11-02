import { useEffect, useState } from "react";
import type { ExerciseResponse } from "../types/Exercise";
import type {
  WodType,
  WodCompositionItemRequest,
  WodDefinitionRequest,
} from "../types/Wod";
import { getExercises } from "../api/exercisesApi";
import { createWod } from "../api/wodsApi";
import { createSubmissionGuard } from "../utils/submissionGuard";
import { validateWodDefinition } from "../utils/wodDefinitionValidation";
import CreateWodView from "../views/create-wod/CreateWodView";

function CreateWodPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<WodType>("FOR_TIME");
  const [rounds, setRounds] = useState<number | undefined>();
  const [timeCapSeconds, setTimeCapSeconds] = useState<number | undefined>();

  const [items, setItems] = useState<WodCompositionItemRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitGuard] = useState(createSubmissionGuard);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getExercises()
      .then((data) => {
        if (active) {
          setExercises(data);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar los ejercicios");
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

  function getExercise(exerciseId: number) {
    return exercises.find((exercise) => exercise.id === exerciseId);
  }

  function handleAddExercise() {
    if (exercises.length === 0) {
      return;
    }

    const newItem: WodCompositionItemRequest = {
      exerciseId: exercises[0].id,
    };

    setItems([...items, newItem]);
  }

  function handleExerciseChange(index: number, exerciseId: number) {
    const newItems = [...items];

    // Al cambiar de ejercicio eliminamos las prescripciones anteriores.
    // Así no arrastramos, por ejemplo, el peso de un Back Squat a un Run.
    newItems[index] = {
      exerciseId,
    };

    setItems(newItems);
  }

  function handleTypeChange(newType: WodType) {
    setType(newType);

    if (newType !== "FOR_TIME") {
      setRounds(undefined);
    }
  }

  function handleRepsChange(index: number, reps: number | undefined) {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      reps,
    };

    setItems(newItems);
  }

  function handleWeightChange(index: number, weightKg: number | undefined) {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      weightKg,
    };

    setItems(newItems);
  }

  function handleDistanceChange(index: number, distanceM: number | undefined) {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      distanceM,
    };

    setItems(newItems);
  }

  function handleDurationChange(
    index: number,
    durationSeconds: number | undefined,
  ) {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      durationSeconds,
    };

    setItems(newItems);
  }

  function handleRemoveExercise(index: number) {
    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const request: WodDefinitionRequest = {
      name: name.trim(),
      type,
      timeCapSeconds,
      rounds: type === "FOR_TIME" ? rounds : undefined,
      items,
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

      const createdWod = await createWod(request);

      setSuccess(`WOD "${createdWod.name}" creado correctamente`);

      setName("");
      setType("FOR_TIME");
      setRounds(undefined);
      setTimeCapSeconds(undefined);
      setItems([]);
    } catch {
      setError("No se pudo crear el WOD");
    } finally {
      submitGuard.release();
      setSubmitting(false);
    }
  }

  return (
    <CreateWodView
      exercises={exercises}
      name={name}
      type={type}
      rounds={rounds}
      timeCapSeconds={timeCapSeconds}
      items={items}
      loading={loading}
      submitting={submitting}
      error={error}
      success={success}
      getExercise={getExercise}
      onNameChange={setName}
      onTypeChange={handleTypeChange}
      onRoundsChange={setRounds}
      onTimeCapChange={setTimeCapSeconds}
      onExerciseChange={handleExerciseChange}
      onRepsChange={handleRepsChange}
      onWeightChange={handleWeightChange}
      onDistanceChange={handleDistanceChange}
      onDurationChange={handleDurationChange}
      onAddExercise={handleAddExercise}
      onRemoveExercise={handleRemoveExercise}
      onSubmit={handleSubmit}
    />
  );
}

export default CreateWodPage;
