export interface NavigationItem {
  label: string;
  to: string;
  icon: NavigationIconName;
}

export type NavigationIconName =
  | "activity"
  | "barbell"
  | "clock"
  | "document"
  | "plus"
  | "trophy";

export const publicNavigation: readonly NavigationItem[] = [
  { label: "Ejercicios", to: "/exercises", icon: "activity" },
  { label: "WODs", to: "/wods", icon: "barbell" },
];

export const personalNavigation: readonly NavigationItem[] = [
  { label: "Mis WODs", to: "/my-wods", icon: "document" },
  { label: "Crear WOD", to: "/create-wod", icon: "plus" },
  { label: "Historial", to: "/history", icon: "clock" },
  { label: "Mis marcas", to: "/my-exercise-results", icon: "activity" },
  { label: "Mejores marcas", to: "/personal-bests", icon: "trophy" },
];

export const mobilePrimaryNavigation: readonly NavigationItem[] = [
  publicNavigation[0],
  publicNavigation[1],
  personalNavigation[1],
  personalNavigation[2],
];

export const mobileMoreNavigation: readonly NavigationItem[] = [
  personalNavigation[0],
  personalNavigation[3],
  personalNavigation[4],
];
