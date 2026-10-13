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

/* ========================================
   NAVEGACIÓN PÚBLICA
   ======================================== */

export const publicNavigation: readonly NavigationItem[] = [
  { label: "Ejercicios", to: "/exercises", icon: "activity" },
  { label: "WODs", to: "/wods", icon: "barbell" },
];

/* ========================================
   NAVEGACIÓN PERSONAL
   ======================================== */

export const personalNavigation: readonly NavigationItem[] = [
  { label: "Mis WODs", to: "/my-wods", icon: "document" },
  { label: "Crear WOD", to: "/create-wod", icon: "plus" },
  { label: "Historial", to: "/history", icon: "clock" },
  { label: "Registrar marca", to: "/exercise-results/new", icon: "plus" },
  { label: "Mis marcas", to: "/my-exercise-results", icon: "activity" },
  { label: "Mejores marcas", to: "/personal-bests", icon: "trophy" },
];

/* ========================================
   DOCK MÓVIL — 5 SECCIONES
   ======================================== */

export const mobilePrimaryNavigation: readonly NavigationItem[] = [
  publicNavigation[0], // Ejercicios
  publicNavigation[1], // WODs
  personalNavigation[0], // Mis WODs

  {
    label: "Marcas",
    to: "/my-exercise-results",
    icon: "trophy",
  },

  personalNavigation[2], // Historial
];

/* ========================================
   NAVEGACIÓN SECUNDARIA
   ======================================== */

export const mobileMoreNavigation: readonly NavigationItem[] = [];
