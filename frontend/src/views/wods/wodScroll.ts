export const WOD_SCROLL_TOP_THRESHOLD = 400;

export function shouldShowScrollTop(scrollY: number) {
  return scrollY > WOD_SCROLL_TOP_THRESHOLD;
}

export function getScrollBehavior(
  prefersReducedMotion: boolean,
): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}
