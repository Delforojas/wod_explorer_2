import type { FormEventHandler } from "react";
import type { WodAggregateResponse } from "../../types/Wod";

export interface WodResultFormValues {
  wodId: string;
  performedAt: string;
  completed: boolean;
  timeSeconds: string;
  progressRounds: string;
  progressItemId: string;
  progressReps: string;
  progressDistanceM: string;
  progressDurationSeconds: string;
  amrapRounds: string;
  amrapExtraReps: string;
}

export interface RegisterWodResultViewProps {
  wods: WodAggregateResponse[];
  selectedWod: WodAggregateResponse | null;
  values: WodResultFormValues;
  loading: boolean;
  saving: boolean;
  error: string | null;

  onChange: (field: keyof WodResultFormValues, value: string | boolean) => void;

  onSubmit: FormEventHandler<HTMLFormElement>;
}
