import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { getExercises } from "../api/exercisesApi";
import { createExerciseResult } from "../api/exerciseResultsApi";

import type { ExerciseResponse } from "../types/Exercise";
import type { ExerciseResultRequest } from "../api/apiTypes";
import { resolveExerciseSelection } from "../utils/exerciseSelection";

import RegisterExerciseResultView from "../views/register-exercise-result/RegisterExerciseResultView";

function RegisterExerciseResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const exerciseIdParam = searchParams.get("exerciseId");

  // TEMPORIZADOR DE REDIRECCIÓN

  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ESTADO

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

  // CARGAR EJERCICIOS

  useEffect(() => {
    getExercises()
      .then((data) => {
        setExercises(data);

        const selection = resolveExerciseSelection(data, exerciseIdParam);

        setSelectedExerciseId(selection.selectedExerciseId);
        setError(selection.error);
      })
      .catch(() => {
        setError("No se pudieron cargar los ejercicios");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [exerciseIdParam]);

  // LIMPIAR TEMPORIZADOR AL SALIR DE LA PÁGINA

  useEffect(() => {
    return () => {
      if (redirectTimer.current !== null) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // EJERCICIO SELECCIONADO

  const selectedExercise = exercises.find(
    (exercise) => exercise.id === selectedExerciseId,
  );

  // REINICIAR CAMPOS

  function resetResultFields() {
    setReps(undefined);
    setWeightKg(undefined);
    setDistanceM(undefined);
    setDurationSeconds(undefined);
  }

  // CAMBIAR EJERCICIO

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

  // REGISTRAR RESULTADO

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Evitar envíos duplicados durante la petición o tras el éxito
    if (submitting || success !== null) {
      return;
    }

    setError(null);

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

    // VALIDAR SEGÚN EL TIPO DE MEDICIÓN

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

    // GUARDAR RESULTADO EN EL BACKEND

    try {
      setSubmitting(true);

      await createExerciseResult(request);

      // MOSTRAR CONFIRMACIÓN

      setSuccess("✓ Marca registrada correctamente");

      // LIMPIAR FORMULARIO

      setSelectedExerciseId(undefined);
      setPerformedAt("");

      resetResultFields();

      // CANCELAR TEMPORIZADOR ANTERIOR SI EXISTE

      if (redirectTimer.current !== null) {
        clearTimeout(redirectTimer.current);
      }

      // REDIRIGIR DESPUÉS DE 3 SEGUNDOS

      redirectTimer.current = setTimeout(() => {
        navigate("/my-exercise-results", {
          replace: true,
        });
      }, 3000);
    } catch {
      setError("No se pudo registrar la marca");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RegisterExerciseResultView
      exercises={exercises}
      selectedExerciseId={selectedExerciseId}
      selectedExercise={selectedExercise}
      reps={reps}
      weightKg={weightKg}
      distanceM={distanceM}
      durationSeconds={durationSeconds}
      performedAt={performedAt}
      loading={loading}
      submitting={submitting || success !== null}
      error={error}
      success={success}
      onExerciseChange={handleExerciseChange}
      onRepsChange={setReps}
      onWeightChange={setWeightKg}
      onDistanceChange={setDistanceM}
      onDurationChange={setDurationSeconds}
      onPerformedAtChange={setPerformedAt}
      onSubmit={handleSubmit}
    />
  );
}

export default RegisterExerciseResultPage;
