import type { Wod } from "../types/Wod";

export async function getWods(): Promise<Wod[]> {
  const response = await fetch("http://localhost:8080/api/wods");

  if (!response.ok) {
    throw new Error("Error al obtener los WODs");
  }

  return response.json();
}
