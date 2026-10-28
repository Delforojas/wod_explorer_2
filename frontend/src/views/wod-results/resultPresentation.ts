import type { WodResultResponse } from "../../types/WodResult";

export function formatWodResultDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatWodResultTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function formatWodOrigin(origin: WodResultResponse["origin"]): string {
  return origin === "PERSONAL" ? "Personal" : "Genérico";
}

export function formatWodType(type: WodResultResponse["type"]): string {
  return type === "FOR_TIME" ? "FOR TIME" : type;
}

export function getWodResultLines(result: WodResultResponse): string[] {
  if (result.type === "AMRAP") {
    return [
      `${result.amrapRounds ?? 0} rondas + ${result.amrapExtraReps ?? 0} reps`,
    ];
  }

  if (result.type === "EMOM") {
    return [result.completed ? "Completado" : "No completado"];
  }

  if (result.completed && result.timeSeconds !== null) {
    return [`Tiempo: ${formatWodResultTime(result.timeSeconds)}`];
  }

  const progress = ["No completado"];

  if (result.progressRounds !== null) {
    progress.push(`Rondas completadas: ${result.progressRounds}`);
  }

  if (result.progressReps !== null) {
    progress.push(`Progreso: ${result.progressReps} reps`);
  }

  if (result.progressDistanceM !== null) {
    progress.push(`Progreso: ${result.progressDistanceM} m`);
  }

  if (result.progressDurationSeconds !== null) {
    progress.push(`Progreso: ${result.progressDurationSeconds} segundos`);
  }

  return progress;
}
