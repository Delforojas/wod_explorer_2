import type { WodResultResponse } from "../../types/WodResult";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";

export type HistoryMode = "ALL" | "WODS" | "EXERCISES";

export type HistoryEntry =
  | {
      kind: "WOD";
      result: WodResultResponse;
    }
  | {
      kind: "EXERCISE";
      result: ExerciseResultResponse;
    };

export interface HistoryFilterValues {
  from: string;
  to: string;
}

export interface HistoryViewProps {
  entries: HistoryEntry[];
  mode: HistoryMode;
  filters: HistoryFilterValues;
  appliedFilters: HistoryFilterValues;
  dateFiltersOpen: boolean;
  dateFiltersMounted: boolean;
  wodLoading: boolean;
  exerciseLoading: boolean;
  wodError: string | null;
  exerciseError: string | null;
  onFilterChange: (
    field: keyof HistoryFilterValues,
    value: string,
  ) => void;
  onModeChange: (mode: HistoryMode) => void;
  onToggleDateFilters: () => void;
  onDateFiltersAnimationEnd: () => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onRetryWods: () => void;
  onRetryExercises: () => void;
}
