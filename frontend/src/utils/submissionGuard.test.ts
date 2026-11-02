import { describe, expect, it } from "vitest";

import { createSubmissionGuard } from "./submissionGuard";

describe("submission guard", () => {
  it("allows one in-flight submission and rejects duplicates", () => {
    const guard = createSubmissionGuard();

    expect(guard.tryAcquire()).toBe(true);
    expect(guard.tryAcquire()).toBe(false);

    guard.release();

    expect(guard.tryAcquire()).toBe(true);
  });
});
