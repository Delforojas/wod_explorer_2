import type { FormEvent } from "react";
import type { ExerciseResponse } from "../../types/Exercise";
import type { WodCompositionItemRequest, WodType } from "../../types/Wod";

export interface CreateWodViewProps {
  exercises: ExerciseResponse[];
  name: string;
  type: WodType;
  rounds: number | undefined;
  timeCapSeconds: number | undefined;
  items: WodCompositionItemRequest[];
  loading: boolean;
  error: string | null;
  success: string | null;
  getExercise: (exerciseId: number) => ExerciseResponse | undefined;
  onNameChange: (value: string) => void;
  onTypeChange: (value: WodType) => void;
  onRoundsChange: (value: number | undefined) => void;
  onTimeCapChange: (value: number | undefined) => void;
  onExerciseChange: (index: number, exerciseId: number) => void;
  onRepsChange: (index: number, reps: number | undefined) => void;
  onWeightChange: (index: number, weightKg: number | undefined) => void;
  onDistanceChange: (index: number, distanceM: number | undefined) => void;
  onDurationChange: (
    index: number,
    durationSeconds: number | undefined,
  ) => void;
  onAddExercise: () => void;
  onRemoveExercise: (index: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
