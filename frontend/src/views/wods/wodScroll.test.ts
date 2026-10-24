import { describe, expect, it } from "vitest";

import {
  getScrollBehavior,
  shouldShowScrollTop,
  WOD_SCROLL_TOP_THRESHOLD,
} from "./wodScroll";

describe("shouldShowScrollTop", () => {
  it("keeps the button hidden at and below the threshold", () => {
    expect(shouldShowScrollTop(0)).toBe(false);
    expect(shouldShowScrollTop(WOD_SCROLL_TOP_THRESHOLD)).toBe(false);
  });

  it("shows the button after the threshold", () => {
    expect(shouldShowScrollTop(WOD_SCROLL_TOP_THRESHOLD + 1)).toBe(true);
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
