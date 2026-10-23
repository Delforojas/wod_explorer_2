import type { WodAggregateResponse } from "../../types/Wod";

export interface WodsViewProps {
  wods: WodAggregateResponse[];
  selectedWod: WodAggregateResponse | null;
  loading: boolean;
  error: string | null;
  onSelectWod: (id: number) => void;
  onBack: () => void;
}
