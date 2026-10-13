import type { FormEvent } from "react";

import type { ExerciseResponse } from "../../types/Exercise";

import type {
  WodAggregateResponse,
  WodCompositionItemRequest,
  WodType,
} from "../../types/Wod";

export interface MyWodsViewProps {
  // Datos de los WODs
  wods: WodAggregateResponse[];
  exercises: ExerciseResponse[];
  selectedWod: WodAggregateResponse | null;

  // Edición de WODs
  editingWod: WodAggregateResponse | null;
  editName: string;
  editType: WodType;
  editRounds: number | undefined;
  editTimeCapSeconds: number | undefined;
  editItems: WodCompositionItemRequest[];

  // Estados
  loading: boolean;
  error: string | null;

  // Consultas
  getExercise: (exerciseId: number) => ExerciseResponse | undefined;

  // Acciones de los WODs
  onSelectWod: (id: number) => void;
  onEditWod: (wod: WodAggregateResponse) => void;
  onDeleteWod: (id: number) => void;
  onCancelEdit: () => void;

  // Modificación de los datos
  onEditNameChange: (value: string) => void;
  onEditTypeChange: (value: WodType) => void;
  onEditRoundsChange: (value: number | undefined) => void;
  onEditTimeCapChange: (value: number | undefined) => void;

  // Modificación de ejercicios
  onEditExerciseChange: (index: number, exerciseId: number) => void;

  onEditRepsChange: (index: number, reps: number | undefined) => void;

  onEditWeightChange: (index: number, weightKg: number | undefined) => void;

  onEditDistanceChange: (index: number, distanceM: number | undefined) => void;

  onEditDurationChange: (
    index: number,
    durationSeconds: number | undefined,
  ) => void;

  // Gestión de ejercicios
  onAddEditExercise: () => void;
  onRemoveEditExercise: (index: number) => void;

  // Guardar cambios
  onUpdateWod: (event: FormEvent<HTMLFormElement>) => void;

  // Navegación
  onBack: () => void;
}
