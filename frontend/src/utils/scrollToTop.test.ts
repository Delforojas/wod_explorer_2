import { describe, expect, it } from "vitest";

import {
  getScrollBehavior,
  getScrollToTopOptions,
  SCROLL_TOP_THRESHOLD,
  shouldShowScrollTop,
} from "./scrollToTop";

describe("shouldShowScrollTop", () => {
  it("keeps the button hidden at and below the threshold", () => {
    expect(shouldShowScrollTop(0)).toBe(false);
    expect(shouldShowScrollTop(SCROLL_TOP_THRESHOLD)).toBe(false);
  });

  it("shows the button after the threshold", () => {
    expect(shouldShowScrollTop(SCROLL_TOP_THRESHOLD + 1)).toBe(true);
  });
});

describe("getScrollBehavior", () => {
  it("uses smooth scrolling by default", () => {
    expect(getScrollBehavior(false)).toBe("smooth");
  });

  it("disables animation for reduced motion", () => {
    expect(getScrollBehavior(true)).toBe("auto");
  });
});

describe("getScrollToTopOptions", () => {
  it("returns the top position and smooth behavior by default", () => {
    expect(getScrollToTopOptions(false)).toEqual({
      top: 0,
      behavior: "smooth",
    });
  });

  it("returns instant behavior for reduced motion", () => {
    expect(getScrollToTopOptions(true)).toEqual({
      top: 0,
      behavior: "auto",
    });
  });
});
