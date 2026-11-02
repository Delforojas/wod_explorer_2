import type { ExerciseResponse, MeasurementType } from "../types/Exercise";
import type {
  WodCompositionItemRequest,
  WodDefinitionRequest,
} from "../types/Wod";

type PrescriptionField = keyof Omit<WodCompositionItemRequest, "exerciseId">;

const prescriptionFields: readonly PrescriptionField[] = [
  "reps",
  "weightKg",
  "distanceM",
  "durationSeconds",
];

const requiredFieldsByMeasurement: Record<
  MeasurementType,
  readonly PrescriptionField[]
> = {
  REPS: ["reps"],
  WEIGHT: ["reps", "weightKg"],
  TIME: ["durationSeconds"],
  DISTANCE: ["distanceM"],
  WEIGHT_DISTANCE: ["weightKg", "distanceM"],
  DISTANCE_TIME: ["distanceM", "durationSeconds"],
};

const fieldLabels: Record<PrescriptionField, string> = {
  reps: "repeticiones",
  weightKg: "peso",
  distanceM: "distancia",
  durationSeconds: "duración",
};

export interface WodDefinitionValidationError {
  path: string;
  message: string;
}

function isPresent(value: number | undefined): boolean {
  return value !== undefined;
}

function isValidValue(field: PrescriptionField, value: number): boolean {
  if (!Number.isFinite(value) || value < 0) {
    return false;
  }

  return (field === "reps" || field === "durationSeconds")
    ? Number.isInteger(value)
    : true;
}

export function validateWodDefinition(
  request: WodDefinitionRequest,
  exercises: ExerciseResponse[],
): WodDefinitionValidationError[] {
  const errors: WodDefinitionValidationError[] = [];

  if (request.name.trim().length === 0 || request.name.length > 100) {
    errors.push({
      path: "name",
      message: "El nombre del WOD debe tener entre 1 y 100 caracteres.",
    });
  }

  if (request.type !== "FOR_TIME" && request.timeCapSeconds === undefined) {
    errors.push({
      path: "timeCapSeconds",
      message: "AMRAP y EMOM requieren un tiempo límite positivo.",
    });
  }

  if (request.type !== "FOR_TIME" && request.rounds !== undefined) {
    errors.push({
      path: "rounds",
      message: "AMRAP y EMOM no admiten rondas en la definición.",
    });
  }

  if (
    request.timeCapSeconds !== undefined &&
    (!Number.isInteger(request.timeCapSeconds) || request.timeCapSeconds <= 0)
  ) {
    errors.push({
      path: "timeCapSeconds",
      message: "El tiempo límite debe ser un número entero positivo.",
    });
  }

  if (
    request.rounds !== undefined &&
    (!Number.isInteger(request.rounds) || request.rounds <= 0)
  ) {
    errors.push({
      path: "rounds",
      message: "Las rondas deben ser un número entero positivo.",
    });
  }

  if (request.items.length === 0) {
    errors.push({
      path: "items",
      message: "Añade al menos un ejercicio al WOD.",
    });
  }

  request.items.forEach((item, index) => {
    const exercise = exercises.find(({ id }) => id === item.exerciseId);
    const exerciseLabel = exercise?.name ?? `#${index + 1}`;
    const itemPath = `items.${index}`;

    if (!exercise) {
      errors.push({
        path: `${itemPath}.exerciseId`,
        message: `El ejercicio ${index + 1} no está disponible.`,
      });
      return;
    }

    const requiredFields = requiredFieldsByMeasurement[exercise.measurementType];

    requiredFields.forEach((field) => {
      if (!isPresent(item[field])) {
        errors.push({
          path: `${itemPath}.${field}`,
          message: `La prescripción de ${exerciseLabel} requiere ${fieldLabels[field]}.`,
        });
      }
    });

    prescriptionFields.forEach((field) => {
      const value = item[field];

      if (value !== undefined && !isValidValue(field, value)) {
        errors.push({
          path: `${itemPath}.${field}`,
          message: `La ${fieldLabels[field]} de ${exerciseLabel} debe ser un valor válido y no negativo.`,
        });
      }

      if (value !== undefined && !requiredFields.includes(field)) {
        errors.push({
          path: `${itemPath}.${field}`,
          message: `${exerciseLabel} no admite ${fieldLabels[field]} con medición ${exercise.measurementType}.`,
        });
      }
    });
  });

  return errors;
}
