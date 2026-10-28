import type { WodResultResponse } from "../../types/WodResult";
import type { WodOrigin, WodType } from "../../types/Wod";

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
  results: WodResultResponse[];
  wods: HistoryWodOption[];
  filters: HistoryFilterValues;
  loading: boolean;
  error: string | null;
  onFilterChange: (
    field: keyof HistoryFilterValues,
    value: string,
  ) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}
