export interface NavigationItem {
  label: string;
  to: string;
}

export const publicNavigation: readonly NavigationItem[] = [
  { label: "Ejercicios", to: "/exercises" },
  { label: "WODs", to: "/wods" },
];

export const personalNavigation: readonly NavigationItem[] = [
  { label: "Mis WODs", to: "/my-wods" },
  { label: "Crear WOD", to: "/create-wod" },
  { label: "Historial", to: "/history" },
  { label: "Mis marcas", to: "/my-exercise-results" },
  { label: "Mejores marcas", to: "/personal-bests" },
];
