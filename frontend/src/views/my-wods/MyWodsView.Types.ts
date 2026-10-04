import type { FormEvent } from "react";

import type { ExerciseResponse } from "../../types/Exercise";
import type {
  WodAggregateResponse,
  WodCompositionItemRequest,
  WodType,
} from "../../types/Wod";

export interface MyWodsViewProps {
  wods: WodAggregateResponse[];
  exercises: ExerciseResponse[];
  selectedWod: WodAggregateResponse | null;

  registeringResult: boolean;
  resultPerformedAt: string;
  amrapRounds: number | undefined;
  amrapExtraReps: number | undefined;
  resultSuccess: string | null;

  editingWod: WodAggregateResponse | null;
  editName: string;
  editType: WodType;
  editRounds: number | undefined;
  editTimeCapSeconds: number | undefined;
  editItems: WodCompositionItemRequest[];

  loading: boolean;
  error: string | null;

  getExercise: (exerciseId: number) => ExerciseResponse | undefined;

  onSelectWod: (id: number) => void;
  onEditWod: (wod: WodAggregateResponse) => void;
  onDeleteWod: (id: number) => void;
  onCancelEdit: () => void;

  onEditNameChange: (value: string) => void;
  onEditTypeChange: (value: WodType) => void;
  onEditRoundsChange: (value: number | undefined) => void;
  onEditTimeCapChange: (value: number | undefined) => void;
  onEditExerciseChange: (index: number, exerciseId: number) => void;
  onEditRepsChange: (index: number, reps: number | undefined) => void;
  onEditWeightChange: (index: number, weightKg: number | undefined) => void;
  onEditDistanceChange: (index: number, distanceM: number | undefined) => void;
  onEditDurationChange: (
    index: number,
    durationSeconds: number | undefined,
  ) => void;

  onAddEditExercise: () => void;
  onRemoveEditExercise: (index: number) => void;
  onUpdateWod: (event: FormEvent<HTMLFormElement>) => void;

  onBack: () => void;

  onStartRegisterResult: () => void;
  onCancelRegisterResult: () => void;
  onResultPerformedAtChange: (value: string) => void;
  onAmrapRoundsChange: (value: number | undefined) => void;
  onAmrapExtraRepsChange: (value: number | undefined) => void;
  onCreateAmrapResult: (event: FormEvent<HTMLFormElement>) => void;
}
