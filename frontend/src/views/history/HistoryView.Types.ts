import type { WodResultResponse } from "../../types/WodResult";
import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import type { WodOrigin, WodType } from "../../types/Wod";

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

export interface HistoryWodOption {
  id: number;
  name: string;
}

export interface HistoryFilterValues {
  wodId: string;
  type: WodType | "";
  origin: WodOrigin | "";
  from: string;
  to: string;
}

export interface HistoryViewProps {
  entries: HistoryEntry[];
  wods: HistoryWodOption[];
  mode: HistoryMode;
  filters: HistoryFilterValues;
  wodLoading: boolean;
  exerciseLoading: boolean;
  wodError: string | null;
  exerciseError: string | null;
  onFilterChange: (
    field: keyof HistoryFilterValues,
    value: string,
  ) => void;
  onModeChange: (mode: HistoryMode) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onRetryWods: () => void;
  onRetryExercises: () => void;
}
