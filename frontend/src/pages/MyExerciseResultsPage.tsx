import { useEffect, useState } from "react";
import {
  deleteExerciseResult,
  getExercisePersonalBests,
  getExerciseResults,
} from "../api/exerciseResultsApi";
import { getExercises } from "../api/exercisesApi";
import { createSubmissionGuard } from "../utils/submissionGuard";
import type { ExerciseResultResponse } from "../types/ExerciseResult";
import type { ExerciseResponse } from "../types/Exercise";
import MyExerciseResultsView from "../views/exercise-results/MyExerciseResultsView";
import type { ExerciseResultsMode } from "../views/exercise-results/exerciseResultsMode";

type ResourceStatus = "idle" | "loading" | "success" | "error";

interface ResourceState<T> {
  data: T;
  status: ResourceStatus;
  error: string | null;
}

const initialResultsState: ResourceState<ExerciseResultResponse[]> = {
  data: [],
  status: "loading",
  error: null,
};

const initialExercisesState: ResourceState<ExerciseResponse[]> = {
  data: [],
  status: "loading",
  error: null,
};

const initialPersonalBestsState: ResourceState<ExerciseResultResponse[]> = {
  data: [],
  status: "loading",
  error: null,
};

function MyExerciseResultsPage() {
  const [resultsState, setResultsState] =
    useState<ResourceState<ExerciseResultResponse[]>>(initialResultsState);
  const [personalBestsState, setPersonalBestsState] = useState<
    ResourceState<ExerciseResultResponse[]>
  >(initialPersonalBestsState);
  const [exercisesState, setExercisesState] =
    useState<ResourceState<ExerciseResponse[]>>(initialExercisesState);
  const [mode, setMode] = useState<ExerciseResultsMode>("all");
  const [resultsReloadKey, setResultsReloadKey] = useState(0);
  const [personalBestsReloadKey, setPersonalBestsReloadKey] = useState(0);
  const [exercisesReloadKey, setExercisesReloadKey] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteGuard] = useState(createSubmissionGuard);

  useEffect(() => {
    let cancelled = false;

    getExerciseResults()
      .then((resultsData) => {
        if (cancelled) {
          return;
        }

        setResultsState({ data: resultsData, status: "success", error: null });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setResultsState((current) => ({
          ...current,
          status: "error",
          error: "No se pudieron cargar tus marcas",
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [resultsReloadKey]);

  useEffect(() => {
    let cancelled = false;

    getExercises()
      .then((exercisesData) => {
        if (cancelled) {
          return;
        }

        setExercisesState({
          data: exercisesData,
          status: "success",
          error: null,
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setExercisesState((current) => ({
          ...current,
          status: "error",
          error: "No se pudieron cargar los nombres de los ejercicios",
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [exercisesReloadKey]);

  useEffect(() => {
    let cancelled = false;

    getExercisePersonalBests()
      .then((personalBestsData) => {
        if (cancelled) {
          return;
        }

        setPersonalBestsState({
          data: personalBestsData,
          status: "success",
          error: null,
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setPersonalBestsState((current) => ({
          ...current,
          status: "error",
          error: "No se pudieron cargar tus mejores marcas",
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [personalBestsReloadKey]);

  function handleModeChange(nextMode: ExerciseResultsMode) {
    setMode(nextMode);
  }

  function retryPersonalBests() {
    setPersonalBestsState({ data: [], status: "loading", error: null });
    setPersonalBestsReloadKey((current) => current + 1);
  }

  function retryResults() {
    setResultsState((current) => ({
      ...current,
      status: "loading",
      error: null,
    }));
    setResultsReloadKey((current) => current + 1);
  }

  function retryExercises() {
    setExercisesState((current) => ({
      ...current,
      status: "loading",
      error: null,
    }));
    setExercisesReloadKey((current) => current + 1);
  }

  async function handleDelete(id: number) {
    if (deletingId !== null) {
      return;
    }

    if (!deleteGuard.tryAcquire()) {
      return;
    }

    if (!window.confirm("¿Quieres eliminar esta marca?")) {
      deleteGuard.release();
      return;
    }

    setDeleteError(null);
    setDeletingId(id);

    try {
      await deleteExerciseResult(id);

      setResultsState({ data: [], status: "loading", error: null });
      setPersonalBestsState({ data: [], status: "loading", error: null });
      setResultsReloadKey((current) => current + 1);
      setPersonalBestsReloadKey((current) => current + 1);
    } catch (cause) {
      setDeleteError(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar la marca",
      );
    } finally {
      deleteGuard.release();
      setDeletingId(null);
    }
  }

  return (
    <MyExerciseResultsView
      results={resultsState.data}
      personalBests={personalBestsState.data}
      exercises={exercisesState.data}
      mode={mode}
      resultsLoading={resultsState.status === "loading"}
      personalBestsLoading={personalBestsState.status === "loading"}
      resultsError={resultsState.error}
      personalBestsError={personalBestsState.error}
      exercisesError={exercisesState.error}
      deleteError={deleteError}
      deletingId={deletingId}
      onModeChange={handleModeChange}
      onRetryResults={retryResults}
      onRetryPersonalBests={retryPersonalBests}
      onRetryExercises={retryExercises}
      onDelete={handleDelete}
    />
  );
}

export default MyExerciseResultsPage;
