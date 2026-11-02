import { useEffect, useState } from "react";

import { getExerciseResults } from "../api/exerciseResultsApi";
import { getAvailableWods } from "../api/wodsApi";
import { getWodResults } from "../api/wodsResultsApi";

import type { WodOrigin, WodType } from "../types/Wod";
import type { ExerciseResultResponse } from "../types/ExerciseResult";
import type { WodResultResponse } from "../types/WodResult";
import HistoryView from "../views/history/HistoryView";
import {
  filterHistoryEntries,
  normalizeHistoryResults,
} from "../views/history/historyPresentation";
import type {
  HistoryFilterValues,
  HistoryMode,
  HistoryWodOption,
} from "../views/history/HistoryView.Types";

const initialFilters: HistoryFilterValues = {
  wodId: "",
  type: "",
  origin: "",
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
    wodId: filters.wodId ? Number(filters.wodId) : undefined,
    type: filters.type || undefined,
    origin: filters.origin || undefined,
    from: filters.from ? `${filters.from}T00:00:00` : undefined,
    to: filters.to ? `${filters.to}T23:59:59` : undefined,
  };
}

function getErrorMessage(cause: unknown): string {
  return cause instanceof Error
    ? cause.message
    : "No se pudo cargar el historial";
}

function mergeWodOptions(
  current: HistoryWodOption[],
  incoming: HistoryWodOption[],
): HistoryWodOption[] {
  const options = new Map(current.map((wod) => [wod.id, wod]));

  incoming.forEach((wod) => {
    options.set(wod.id, wod);
  });

  return [...options.values()].sort((first, second) =>
    first.name.localeCompare(second.name),
  );
}

function HistoryPage() {
  const [wodState, setWodState] =
    useState<ResourceState<WodResultResponse[]>>(initialWodState);
  const [exerciseState, setExerciseState] =
    useState<ResourceState<ExerciseResultResponse[]>>(initialExerciseState);
  const [wods, setWods] = useState<HistoryWodOption[]>([]);
  const [mode, setMode] = useState<HistoryMode>("ALL");
  const [filters, setFilters] = useState<HistoryFilterValues>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<HistoryFilterValues>(initialFilters);

  useEffect(() => {
    let active = true;
    const apiFilters = toApiFilters(appliedFilters);

    getWodResults(apiFilters)
      .then((data) => {
        if (!active) {
          return;
        }

        setWodState({ data, loading: false, error: null });
        setWods((current) =>
          mergeWodOptions(
            current,
            data.map((result) => ({ id: result.wodId, name: result.wodName })),
          ),
        );
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

  useEffect(() => {
    getAvailableWods()
      .then((data) => {
        setWods((current) =>
          mergeWodOptions(
            current,
            data.map((wod) => ({ id: wod.id, name: wod.name })),
          ),
        );
      })
      .catch(() => undefined);
  }, []);

  function retryWods() {
    setWodState({ data: [], loading: true, error: null });

    getWodResults(toApiFilters(appliedFilters))
      .then((data) => {
        setWodState({ data, loading: false, error: null });
        setWods((current) =>
          mergeWodOptions(
            current,
            data.map((result) => ({ id: result.wodId, name: result.wodName })),
          ),
        );
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

    if (nextMode !== "WODS") {
      const nextFilters = {
        ...filters,
        wodId: "",
        type: "" as WodType | "",
        origin: "" as WodOrigin | "",
      };
      setWodState({ data: [], loading: true, error: null });
      setExerciseState({ data: [], loading: true, error: null });
      setFilters(nextFilters);
      setAppliedFilters(nextFilters);
    }
  }

  function handleFilterChange(
    field: keyof HistoryFilterValues,
    value: string,
  ) {
    if (field === "wodId" || field === "from" || field === "to") {
      setFilters((current) => ({ ...current, [field]: value }));
      return;
    }

    if (field === "type") {
      const type: WodType | "" =
        value === "FOR_TIME" || value === "AMRAP" || value === "EMOM"
          ? value
          : "";

      setFilters((current) => ({ ...current, type }));
      return;
    }

    const origin: WodOrigin | "" =
      value === "GENERIC" || value === "PERSONAL" ? value : "";

    setFilters((current) => ({ ...current, origin }));
  }

  function applyFilters() {
    setWodState({ data: [], loading: true, error: null });
    setExerciseState({ data: [], loading: true, error: null });
    setAppliedFilters({ ...filters });
  }

  function clearFilters() {
    setWodState({ data: [], loading: true, error: null });
    setExerciseState({ data: [], loading: true, error: null });
    setFilters(initialFilters);
    setAppliedFilters({ ...initialFilters });
  }

  const entries = filterHistoryEntries(
    normalizeHistoryResults(wodState.data, exerciseState.data),
    mode,
    appliedFilters,
  );

  return (
    <HistoryView
      entries={entries}
      wods={wods}
      mode={mode}
      filters={filters}
      wodLoading={wodState.loading}
      exerciseLoading={exerciseState.loading}
      wodError={wodState.error}
      exerciseError={exerciseState.error}
      onFilterChange={handleFilterChange}
      onModeChange={handleModeChange}
      onApplyFilters={applyFilters}
      onClearFilters={clearFilters}
      onRetryWods={retryWods}
      onRetryExercises={retryExercises}
    />
  );
}

export default HistoryPage;
