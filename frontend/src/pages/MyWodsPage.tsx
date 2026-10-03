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

  function handleBack() {
    setRegisteringResult(false);
    setResultSuccess(null);
    setSelectedWod(null);
  }

  if (loading) {
    return <p>Cargando tus WODs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (editingWod) {
    return (
      <section>
        <button type="button" onClick={handleCancelEdit}>
          ← Volver
        </button>

        <h1>Editar WOD</h1>

        <form onSubmit={handleUpdateWod}>
          <div>
            <label htmlFor="edit-name">Nombre</label>

            <input
              id="edit-name"
              type="text"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="edit-type">Modalidad</label>

            <select
              id="edit-type"
              value={editType}
              onChange={(event) => {
                const newType = event.target.value as WodType;

                setEditType(newType);

                if (newType !== "FOR_TIME") {
                  setEditRounds(undefined);
                }
              }}
            >
              <option value="FOR_TIME">For Time</option>
              <option value="AMRAP">AMRAP</option>
              <option value="EMOM">EMOM</option>
            </select>
          </div>

          {editType === "FOR_TIME" && (
            <>
              <div>
                <label htmlFor="edit-rounds">Rondas</label>

                <input
                  id="edit-rounds"
                  type="number"
                  min="1"
                  value={editRounds ?? ""}
                  onChange={(event) =>
                    setEditRounds(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="edit-time-cap">Tiempo límite (segundos)</label>

                <input
                  id="edit-time-cap"
                  type="number"
                  min="1"
                  value={editTimeCapSeconds ?? ""}
                  onChange={(event) =>
                    setEditTimeCapSeconds(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </div>
            </>
          )}

          {(editType === "AMRAP" || editType === "EMOM") && (
            <div>
              <label htmlFor="edit-time-cap">Duración (segundos)</label>

              <input
                id="edit-time-cap"
                type="number"
                min="1"
                value={editTimeCapSeconds ?? ""}
                onChange={(event) =>
                  setEditTimeCapSeconds(
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

          {editItems.map((item, index) => {
            const exercise = getExercise(item.exerciseId);

            return (
              <div key={index}>
                <h3>Ejercicio {index + 1}</h3>

                <div>
                  <label>Ejercicio</label>

                  <select
                    value={item.exerciseId}
                    onChange={(event) =>
                      handleEditExerciseChange(
                        index,
                        Number(event.target.value),
                      )
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
                        handleEditRepsChange(
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
                          handleEditRepsChange(
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
                          handleEditWeightChange(
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
                        handleEditDistanceChange(
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
                        handleEditDurationChange(
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
                          handleEditWeightChange(
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
                          handleEditDistanceChange(
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

                <button
                  type="button"
                  onClick={() => handleRemoveEditExercise(index)}
                >
                  Eliminar ejercicio
                </button>
              </div>
            );
          })}

          <button type="button" onClick={handleAddEditExercise}>
            + Añadir ejercicio
          </button>

          <button type="submit" disabled={editItems.length === 0}>
            Guardar cambios
          </button>

          <button type="button" onClick={handleCancelEdit}>
            Cancelar
          </button>
        </form>
      </section>
    );
  }

  if (selectedWod) {
    return (
      <section>
        <button type="button" onClick={handleBack}>
          ← Volver
        </button>

        <h1>{selectedWod.name}</h1>

        <p>{selectedWod.version.type}</p>

        {selectedWod.version.rounds !== null && (
          <p>Rondas: {selectedWod.version.rounds}</p>
        )}

        {selectedWod.version.timeCapSeconds !== null && (
          <p>
            Tiempo límite: {Math.floor(selectedWod.version.timeCapSeconds / 60)}{" "}
            min
          </p>
        )}

        <h2>Entrenamiento</h2>

        {selectedWod.composition.map((item) => (
          <article key={item.id}>
            <strong>{item.exerciseName}</strong>

            {item.reps !== null && <p>{item.reps} repeticiones</p>}

            {item.weightKg !== null && <p>{item.weightKg} kg</p>}

            {item.distanceM !== null && <p>{item.distanceM} m</p>}

            {item.durationSeconds !== null && (
              <p>{item.durationSeconds} segundos</p>
            )}
          </article>
        ))}

        {resultSuccess && <p>{resultSuccess}</p>}

        {!registeringResult && (
          <button
            type="button"
            onClick={() => {
              setResultSuccess(null);
              setRegisteringResult(true);
            }}
          >
            Registrar resultado
          </button>
        )}

        {registeringResult && selectedWod.version.type === "AMRAP" && (
          <div>
            <h2>Registrar resultado</h2>

            <form onSubmit={handleCreateAmrapResult}>
              <div>
                <label htmlFor="result-performed-at">Fecha y hora</label>

                <input
                  id="result-performed-at"
                  type="datetime-local"
                  value={resultPerformedAt}
                  onChange={(event) => setResultPerformedAt(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="amrap-rounds">Rondas completas</label>

                <input
                  id="amrap-rounds"
                  type="number"
                  min="0"
                  value={amrapRounds ?? ""}
                  onChange={(event) =>
                    setAmrapRounds(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="amrap-extra-reps">Repeticiones extra</label>

                <input
                  id="amrap-extra-reps"
                  type="number"
                  min="0"
                  value={amrapExtraReps ?? ""}
                  onChange={(event) =>
                    setAmrapExtraReps(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                  required
                />
              </div>

              <button type="submit">Guardar resultado</button>

              <button type="button" onClick={() => setRegisteringResult(false)}>
                Cancelar
              </button>
            </form>
          </div>
        )}

        {registeringResult && selectedWod.version.type !== "AMRAP" && (
          <div>
            <h2>Registrar resultado</h2>

            <p>
              El formulario para {selectedWod.version.type} será el siguiente
              que implementemos.
            </p>

            <button type="button" onClick={() => setRegisteringResult(false)}>
              Cancelar
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="placeholder-page">
      <h1>Mis WODs</h1>

      <p>Esta sección permitirá gestionar tus WOD personales.</p>

      {wods.map((wod) => (
        <article key={wod.id}>
          <h2>{wod.name}</h2>

          <p>{wod.version.type}</p>

          <button type="button" onClick={() => handleSelectWod(wod.id)}>
            Ver WOD
          </button>

          <button type="button" onClick={() => handleEditWod(wod)}>
            Editar
          </button>

          <button type="button" onClick={() => handleDeleteWod(wod.id)}>
            Eliminar
          </button>
        </article>
      ))}
    </section>
  );
}

export default MyWodsPage;
