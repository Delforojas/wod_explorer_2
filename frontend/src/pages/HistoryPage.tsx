import { useEffect, useState } from "react";

import { getExerciseResults } from "../api/exerciseResultsApi";
import { getWodResults } from "../api/wodsResultsApi";

import type { ExerciseResultResponse } from "../types/ExerciseResult";
import type { WodResultResponse } from "../types/WodResult";
import HistoryView from "../views/history/HistoryView";
import {
  filterHistoryEntries,
  normalizeHistoryResults,
} from "../views/history/historyPresentation";
import type { HistoryFilterValues, HistoryMode } from "../views/history/HistoryView.Types";

const initialFilters: HistoryFilterValues = {
  from: "",
  to: "",
};

interface ResourceState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

const initialWodState: ResourceState<WodResultResponse[]> = {
  data: [],
  loading: true,
  error: null,
};

const initialExerciseState: ResourceState<ExerciseResultResponse[]> = {
  data: [],
  loading: true,
  error: null,
};

function toApiFilters(filters: HistoryFilterValues) {
  return {
    from: filters.from ? `${filters.from}T00:00:00` : undefined,
    to: filters.to ? `${filters.to}T23:59:59` : undefined,
  };
}

function getErrorMessage(cause: unknown): string {
  return cause instanceof Error
    ? cause.message
    : "No se pudo cargar el historial";
}

function HistoryPage() {
  const [wodState, setWodState] =
    useState<ResourceState<WodResultResponse[]>>(initialWodState);
  const [exerciseState, setExerciseState] =
    useState<ResourceState<ExerciseResultResponse[]>>(initialExerciseState);
  const [mode, setMode] = useState<HistoryMode>("ALL");
  const [filters, setFilters] = useState<HistoryFilterValues>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<HistoryFilterValues>(initialFilters);
  const [dateFiltersOpen, setDateFiltersOpen] = useState(false);
  const [dateFiltersMounted, setDateFiltersMounted] = useState(false);

  useEffect(() => {
    let active = true;
    const apiFilters = toApiFilters(appliedFilters);

    getWodResults(apiFilters)
      .then((data) => {
        if (!active) {
          return;
        }

        setWodState({ data, loading: false, error: null });
      })
      .catch((cause: unknown) => {
        if (active) {
          setWodState({ data: [], loading: false, error: getErrorMessage(cause) });
        }
      });

    getExerciseResults()
      .then((data) => {
        if (active) {
          setExerciseState({ data, loading: false, error: null });
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setExerciseState({
            data: [],
            loading: false,
            error: getErrorMessage(cause),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [appliedFilters]);

  function retryWods() {
    setWodState({ data: [], loading: true, error: null });

    getWodResults(toApiFilters(appliedFilters))
      .then((data) => {
        setWodState({ data, loading: false, error: null });
      })
      .catch((cause: unknown) => {
        setWodState({ data: [], loading: false, error: getErrorMessage(cause) });
      });
  }

  function retryExercises() {
    setExerciseState({ data: [], loading: true, error: null });

    getExerciseResults()
      .then((data) => {
        setExerciseState({ data, loading: false, error: null });
      })
      .catch((cause: unknown) => {
        setExerciseState({
          data: [],
          loading: false,
          error: getErrorMessage(cause),
        });
      });
  }

  function handleModeChange(nextMode: HistoryMode) {
    setMode(nextMode);
  }

  function toggleDateFilters() {
    if (dateFiltersOpen) {
      setDateFiltersOpen(false);
      return;
    }

    setDateFiltersMounted(true);
    setDateFiltersOpen(true);
  }

  function handleDateFiltersAnimationEnd() {
    if (!dateFiltersOpen) {
      setDateFiltersMounted(false);
    }
  }

  function handleFilterChange(
    field: keyof HistoryFilterValues,
    value: string,
  ) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function applyFilters() {
    setWodState({ data: [], loading: true, error: null });
    setExerciseState({ data: [], loading: true, error: null });
    setAppliedFilters({ ...filters });
    setDateFiltersOpen(false);
  }

  function clearFilters() {
    setWodState({ data: [], loading: true, error: null });
    setExerciseState({ data: [], loading: true, error: null });
    setFilters(initialFilters);
    setAppliedFilters({ ...initialFilters });
    setDateFiltersOpen(false);
  }

  const entries = filterHistoryEntries(
    normalizeHistoryResults(wodState.data, exerciseState.data),
    mode,
    appliedFilters,
  );

  return (
    <HistoryView
      entries={entries}
      mode={mode}
      filters={filters}
      appliedFilters={appliedFilters}
      dateFiltersOpen={dateFiltersOpen}
      dateFiltersMounted={dateFiltersMounted}
      wodLoading={wodState.loading}
      exerciseLoading={exerciseState.loading}
      wodError={wodState.error}
      exerciseError={exerciseState.error}
      onFilterChange={handleFilterChange}
      onModeChange={handleModeChange}
      onToggleDateFilters={toggleDateFilters}
      onDateFiltersAnimationEnd={handleDateFiltersAnimationEnd}
      onApplyFilters={applyFilters}
      onClearFilters={clearFilters}
      onRetryWods={retryWods}
      onRetryExercises={retryExercises}
    />
  );
}

export default HistoryPage;
