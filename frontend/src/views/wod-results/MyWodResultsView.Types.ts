import type { WodResultResponse } from "../../types/WodResult";

export interface MyWodResultsViewProps {
  results: WodResultResponse[];
  loading: boolean;
  error: string | null;
  deletingId: number | null;
  onDelete: (id: number) => void;
}
