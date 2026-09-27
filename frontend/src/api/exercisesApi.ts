import type { Exercise } from "../types/Exercise";

export async function getExercises(): Promise<Exercise[]> {
  const response = await fetch("http://localhost:8080/api/exercises");

  if (!response.ok) {
    throw new Error("Error al obtener los ejercicios");
  }

  return response.json();
}
