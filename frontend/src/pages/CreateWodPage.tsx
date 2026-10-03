import { useEffect, useState } from "react";
import type { ExerciseResponse } from "../types/Exercise";
import type {
  WodType,
  WodCompositionItemRequest,
  WodDefinitionRequest,
} from "../types/Wod";
import { getExercises } from "../api/exercisesApi";
import { createWod } from "../api/wodsApi";

function CreateWodPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<WodType>("FOR_TIME");
  const [rounds, setRounds] = useState<number | undefined>();
  const [timeCapSeconds, setTimeCapSeconds] = useState<number | undefined>();

  const [items, setItems] = useState<WodCompositionItemRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    getExercises()
      .then((data) => {
        setExercises(data);
      })
      .catch(() => {
        setError("No se pudieron cargar los ejercicios");
      })
      .finally(() => {
        setLoading(false);
      });
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
      name,
      type,
      timeCapSeconds,
      rounds: type === "FOR_TIME" ? rounds : undefined,
      items,
    };

    try {
      const createdWod = await createWod(request);

      setSuccess(`WOD "${createdWod.name}" creado correctamente`);

      setName("");
      setType("FOR_TIME");
      setRounds(undefined);
      setTimeCapSeconds(undefined);
      setItems([]);
    } catch {
      setError("No se pudo crear el WOD");
    }
  }

  if (loading) {
    return <p>Cargando ejercicios...</p>;
  }

  return (
    <section>
      <header>
        <h1>Crear WOD</h1>
        <p>Crea un nuevo entrenamiento personal.</p>
      </header>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="type">Modalidad</label>

          <select
            id="type"
            value={type}
            onChange={(event) => {
              const newType = event.target.value as WodType;

              setType(newType);

              if (newType !== "FOR_TIME") {
                setRounds(undefined);
              }
            }}
          >
            <option value="FOR_TIME">For Time</option>
            <option value="AMRAP">AMRAP</option>
            <option value="EMOM">EMOM</option>
          </select>
        </div>

        {type === "FOR_TIME" && (
          <>
            <div>
              <label htmlFor="rounds">Rondas</label>

              <input
                id="rounds"
                type="number"
                min="1"
                value={rounds ?? ""}
                onChange={(event) =>
                  setRounds(
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                  )
                }
              />
            </div>

            <div>
              <label htmlFor="time-cap">Tiempo límite (segundos)</label>

              <input
                id="time-cap"
                type="number"
                min="1"
                value={timeCapSeconds ?? ""}
                onChange={(event) =>
                  setTimeCapSeconds(
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                  )
                }
              />
            </div>
          </>
        )}

        {(type === "AMRAP" || type === "EMOM") && (
          <div>
            <label htmlFor="time-cap">Duración (segundos)</label>

            <input
              id="time-cap"
              type="number"
              min="1"
              value={timeCapSeconds ?? ""}
              onChange={(event) =>
                setTimeCapSeconds(
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
              required
            />
          </div>
        )}

        <h2>Ejercicios</h2>

        {items.length === 0 && <p>Todavía no has añadido ejercicios.</p>}

        {items.map((item, index) => {
          const exercise = getExercise(item.exerciseId);

          return (
            <div key={index}>
              <h3>Ejercicio {index + 1}</h3>

              <div>
                <label>Ejercicio</label>

                <select
                  value={item.exerciseId}
                  onChange={(event) =>
                    handleExerciseChange(index, Number(event.target.value))
                  }
                >
                  {exercises.map((availableExercise) => (
                    <option
                      key={availableExercise.id}
                      value={availableExercise.id}
                    >
                      {availableExercise.name}
                    </option>
                  ))}
                </select>
              </div>

              {exercise?.measurementType === "REPS" && (
                <div>
                  <label>Repeticiones</label>

                  <input
                    type="number"
                    min="1"
                    value={item.reps ?? ""}
                    onChange={(event) =>
                      handleRepsChange(
                        index,
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>
              )}

              {exercise?.measurementType === "WEIGHT" && (
                <>
                  <div>
                    <label>Repeticiones</label>

                    <input
                      type="number"
                      min="1"
                      value={item.reps ?? ""}
                      onChange={(event) =>
                        handleRepsChange(
                          index,
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Peso (kg)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.weightKg ?? ""}
                      onChange={(event) =>
                        handleWeightChange(
                          index,
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </div>
                </>
              )}

              {exercise?.measurementType === "DISTANCE" && (
                <div>
                  <label>Distancia (m)</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.distanceM ?? ""}
                    onChange={(event) =>
                      handleDistanceChange(
                        index,
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>
              )}

              {exercise?.measurementType === "TIME" && (
                <div>
                  <label>Duración (segundos)</label>

                  <input
                    type="number"
                    min="1"
                    value={item.durationSeconds ?? ""}
                    onChange={(event) =>
                      handleDurationChange(
                        index,
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>
              )}

              {exercise?.measurementType === "WEIGHT_DISTANCE" && (
                <>
                  <div>
                    <label>Peso (kg)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.weightKg ?? ""}
                      onChange={(event) =>
                        handleWeightChange(
                          index,
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Distancia (m)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.distanceM ?? ""}
                      onChange={(event) =>
                        handleDistanceChange(
                          index,
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </div>
                </>
              )}

              <button type="button" onClick={() => handleRemoveExercise(index)}>
                Eliminar ejercicio
              </button>
            </div>
          );
        })}

        <button type="button" onClick={handleAddExercise}>
          + Añadir ejercicio
        </button>

        <button type="submit" disabled={items.length === 0}>
          Crear WOD
        </button>
      </form>
    </section>
  );
}

export default CreateWodPage;
