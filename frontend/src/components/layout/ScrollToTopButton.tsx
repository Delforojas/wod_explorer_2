import { useEffect, useEffectEvent, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  getScrollToTopOptions,
  shouldShowScrollTop,
} from "../../utils/scrollToTop";

function ScrollToTopButton() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(() =>
    shouldShowScrollTop(window.scrollY),
  );
  const updateVisibility = useEffectEvent(() => {
    setShowScrollTop(shouldShowScrollTop(window.scrollY));
  });

  useEffect(() => {
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(updateVisibility);

    return () => window.cancelAnimationFrame(frameId);
  }, [location.key]);

  function handleScrollToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo(getScrollToTopOptions(prefersReducedMotion));
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  if (!showScrollTop) {
    return null;
  }

  return (
    <button
      type="button"
      className="scroll-to-top"
      onClick={handleScrollToTop}
      aria-label="Volver arriba"
    >
      Volver arriba
    </button>
  );
}

export default ScrollToTopButton;
