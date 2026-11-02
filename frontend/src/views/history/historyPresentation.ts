import type { ExerciseResultResponse } from "../../types/ExerciseResult";
import type { WodResultResponse } from "../../types/WodResult";
import {
  formatWodResultDate,
  formatWodOrigin,
  formatWodResultTime,
  formatWodType,
  getWodResultLines,
} from "../wod-results/resultPresentation";
import type {
  HistoryEntry,
  HistoryFilterValues,
  HistoryMode,
} from "./HistoryView.Types";

export function normalizeHistoryResults(
  wodResults: WodResultResponse[],
  exerciseResults: ExerciseResultResponse[],
): HistoryEntry[] {
  return sortHistoryEntries([
    ...wodResults.map((result) => ({ kind: "WOD" as const, result })),
    ...exerciseResults.map((result) => ({ kind: "EXERCISE" as const, result })),
  ]);
}

export function sortHistoryEntries(entries: HistoryEntry[]): HistoryEntry[] {
  return [...entries].sort((first, second) => {
    const performedAtOrder = second.result.performedAt.localeCompare(
      first.result.performedAt,
    );

    if (performedAtOrder !== 0) {
      return performedAtOrder;
    }

    if (first.kind !== second.kind) {
      return first.kind === "EXERCISE" ? -1 : 1;
    }

    return second.result.id - first.result.id;
  });
}

export function filterHistoryEntries(
  entries: HistoryEntry[],
  mode: HistoryMode,
  filters: HistoryFilterValues,
): HistoryEntry[] {
  return entries.filter((entry) => {
    if (mode === "WODS" && entry.kind !== "WOD") {
      return false;
    }

    if (mode === "EXERCISES" && entry.kind !== "EXERCISE") {
      return false;
    }

    const date = entry.result.performedAt.slice(0, 10);
    if (filters.from && date < filters.from) {
      return false;
    }

    if (filters.to && date > filters.to) {
      return false;
    }

    return true;
  });
}

export function isHistoryDateRangeInvalid(filters: HistoryFilterValues): boolean {
  return Boolean(filters.from && filters.to && filters.from > filters.to);
}

export function formatExerciseResultDate(date: string): string {
  return formatWodResultDate(date);
}

export function getExerciseResultLines(
  result: ExerciseResultResponse,
): string[] {
  switch (result.measurementType) {
    case "WEIGHT":
      return result.weightKg !== null && result.reps !== null
        ? [`${result.weightKg} kg × ${result.reps} reps`]
        : ["Resultado sin datos"];
    case "REPS":
      return result.reps !== null ? [`${result.reps} reps`] : ["Resultado sin datos"];
    case "TIME":
      return result.durationSeconds !== null
        ? [formatExerciseDuration(result.durationSeconds)]
        : ["Resultado sin datos"];
    case "DISTANCE":
      return result.distanceM !== null
        ? [`${result.distanceM} m`]
        : ["Resultado sin datos"];
    case "WEIGHT_DISTANCE":
      return result.weightKg !== null && result.distanceM !== null
        ? [`${result.weightKg} kg · ${result.distanceM} m`]
        : ["Resultado sin datos"];
    case "DISTANCE_TIME":
      return result.distanceM !== null && result.durationSeconds !== null
        ? [`${result.distanceM} m · ${formatExerciseDuration(result.durationSeconds)}`]
        : ["Resultado sin datos"];
  }
}

export function formatExerciseDuration(totalSeconds: number): string {
  return formatWodResultTime(totalSeconds);
}

export { formatWodOrigin, formatWodType, getWodResultLines };
