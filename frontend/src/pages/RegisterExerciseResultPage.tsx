import { useEffect, useState } from "react";

import { getExercises } from "../api/exercisesApi";
import { createExerciseResult } from "../api/exerciseResultsApi";

import type { ExerciseResponse } from "../types/Exercise";
import type { ExerciseResultRequest } from "../api/apiTypes";

function RegisterExerciseResultPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<
    number | undefined
  >(undefined);

  const [reps, setReps] = useState<number | undefined>(undefined);
  const [weightKg, setWeightKg] = useState<number | undefined>(undefined);
  const [distanceM, setDistanceM] = useState<number | undefined>(undefined);
  const [durationSeconds, setDurationSeconds] = useState<number | undefined>(
    undefined,
  );
  const [performedAt, setPerformedAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const selectedExercise = exercises.find(
    (exercise) => exercise.id === selectedExerciseId,
  );

  function resetResultFields() {
    setReps(undefined);
    setWeightKg(undefined);
    setDistanceM(undefined);
    setDurationSeconds(undefined);
  }

  function handleExerciseChange(value: string) {
    resetResultFields();
    setError(null);
    setSuccess(null);

    if (value === "") {
      setSelectedExerciseId(undefined);
      return;
    }

    setSelectedExerciseId(Number(value));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!selectedExercise) {
      setError("Selecciona un ejercicio");
      return;
    }

    if (!performedAt) {
      setError("Indica la fecha y hora del resultado");
      return;
    }

    const request: ExerciseResultRequest = {
      exerciseId: selectedExercise.id,
      performedAt,
    };

    switch (selectedExercise.measurementType) {
      case "WEIGHT":
        if (reps === undefined || weightKg === undefined) {
          setError("Introduce las repeticiones y el peso");
          return;
        }

        request.reps = reps;
        request.weightKg = weightKg;
        break;

      case "REPS":
        if (reps === undefined) {
          setError("Introduce las repeticiones");
          return;
        }

        request.reps = reps;
        break;

      case "TIME":
        if (durationSeconds === undefined) {
          setError("Introduce la duración");
          return;
        }

        request.durationSeconds = durationSeconds;
        break;

      case "DISTANCE":
        if (distanceM === undefined) {
          setError("Introduce la distancia");
          return;
        }

        request.distanceM = distanceM;
        break;

      case "WEIGHT_DISTANCE":
        if (weightKg === undefined || distanceM === undefined) {
          setError("Introduce el peso y la distancia");
          return;
        }

        request.weightKg = weightKg;
        request.distanceM = distanceM;
        break;
      case "DISTANCE_TIME":
        if (distanceM === undefined || durationSeconds === undefined) {
          setError("Introduce la distancia y la duración");
          return;
        }

        request.distanceM = distanceM;
        request.durationSeconds = durationSeconds;
        break;
    }

    try {
      setSubmitting(true);

      await createExerciseResult(request);

      setSuccess("Marca registrada correctamente");

      setSelectedExerciseId(undefined);
      setPerformedAt("");
      resetResultFields();
    } catch {
      setError("No se pudo registrar la marca");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Cargando ejercicios...</p>;
  }

  return (
    <section>
      <h1>Registrar marca</h1>

      <p>Registra un nuevo resultado para uno de tus ejercicios.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="exercise">Ejercicio</label>

          <select
            id="exercise"
            value={selectedExerciseId ?? ""}
            onChange={(event) => handleExerciseChange(event.target.value)}
          >
            <option value="">Selecciona un ejercicio</option>

            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>

        {selectedExercise && (
          <>
            <p>Tipo de medición: {selectedExercise.measurementType}</p>

            {selectedExercise.measurementType === "WEIGHT" && (
              <>
                <div>
                  <label htmlFor="reps">Repeticiones</label>
                  <input
                    id="reps"
                    type="number"
                    min="0"
                    value={reps ?? ""}
                    onChange={(event) =>
                      setReps(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label htmlFor="weightKg">Peso (kg)</label>
                  <input
                    id="weightKg"
                    type="number"
                    min="0"
                    step="0.01"
                    value={weightKg ?? ""}
                    onChange={(event) =>
                      setWeightKg(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>
              </>
            )}

            {selectedExercise.measurementType === "REPS" && (
              <div>
                <label htmlFor="reps">Repeticiones</label>
                <input
                  id="reps"
                  type="number"
                  min="0"
                  value={reps ?? ""}
                  onChange={(event) =>
                    setReps(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </div>
            )}

            {selectedExercise.measurementType === "TIME" && (
              <div>
                <label htmlFor="durationSeconds">Duración (segundos)</label>
                <input
                  id="durationSeconds"
                  type="number"
                  min="0"
                  value={durationSeconds ?? ""}
                  onChange={(event) =>
                    setDurationSeconds(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </div>
            )}

            {selectedExercise.measurementType === "DISTANCE" && (
              <div>
                <label htmlFor="distanceM">Distancia (m)</label>
                <input
                  id="distanceM"
                  type="number"
                  min="0"
                  step="0.01"
                  value={distanceM ?? ""}
                  onChange={(event) =>
                    setDistanceM(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </div>
            )}
            {selectedExercise.measurementType === "DISTANCE_TIME" && (
              <>
                <div>
                  <label htmlFor="distanceM">Distancia (m)</label>
                  <input
                    id="distanceM"
                    type="number"
                    min="0"
                    step="0.01"
                    value={distanceM ?? ""}
                    onChange={(event) =>
                      setDistanceM(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label htmlFor="durationSeconds">Duración (segundos)</label>
                  <input
                    id="durationSeconds"
                    type="number"
                    min="0"
                    value={durationSeconds ?? ""}
                    onChange={(event) =>
                      setDurationSeconds(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>
              </>
            )}
            {selectedExercise.measurementType === "WEIGHT_DISTANCE" && (
              <>
                <div>
                  <label htmlFor="weightKg">Peso (kg)</label>
                  <input
                    id="weightKg"
                    type="number"
                    min="0"
                    step="0.01"
                    value={weightKg ?? ""}
                    onChange={(event) =>
                      setWeightKg(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label htmlFor="distanceM">Distancia (m)</label>
                  <input
                    id="distanceM"
                    type="number"
                    min="0"
                    step="0.01"
                    value={distanceM ?? ""}
                    onChange={(event) =>
                      setDistanceM(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                    }
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="performedAt">Fecha y hora</label>
              <input
                id="performedAt"
                type="datetime-local"
                value={performedAt}
                onChange={(event) => setPerformedAt(event.target.value)}
              />
            </div>
          </>
        )}

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <button type="submit" disabled={!selectedExercise || submitting}>
          {submitting ? "Registrando..." : "Registrar marca"}
        </button>
      </form>
    </section>
  );
}

export default RegisterExerciseResultPage;
