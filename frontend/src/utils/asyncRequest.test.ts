import { describe, expect, it } from "vitest";

import { isLatestRequest } from "./asyncRequest";

describe("async request guards", () => {
  it("accepts only the newest request", () => {
    expect(isLatestRequest(1, 2)).toBe(false);
    expect(isLatestRequest(2, 2)).toBe(true);
  });
});
