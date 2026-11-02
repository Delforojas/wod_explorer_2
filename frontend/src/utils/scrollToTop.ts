export const SCROLL_TOP_THRESHOLD = 400;

export function shouldShowScrollTop(scrollY: number) {
  return scrollY > SCROLL_TOP_THRESHOLD;
}

export function getScrollBehavior(
  prefersReducedMotion: boolean,
): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}

export function getScrollToTopOptions(
  prefersReducedMotion: boolean,
): ScrollToOptions {
  return {
    top: 0,
    behavior: getScrollBehavior(prefersReducedMotion),
  };
}
