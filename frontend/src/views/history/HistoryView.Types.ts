import type { WodResultResponse } from "../../types/WodResult";

export interface HistoryViewProps {
  results: WodResultResponse[];
  loading: boolean;
  error: string | null;
}
