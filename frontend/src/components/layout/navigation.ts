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
  { label: "Historial", to: "/history" },
  { label: "Mejores marcas", to: "/personal-bests" },
];
