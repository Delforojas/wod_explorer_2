import { describe, expect, it, vi } from "vitest";
import { completeGoogleCallback, parseGoogleCallback } from "./googleCallback";

describe("Google callback parameters", () => {
  it("reads the opaque handoff code", () => {
    expect(parseGoogleCallback("?code=opaque-code")).toEqual({
      kind: "code",
      code: "opaque-code",
    });
  });

  it("returns a recoverable provider error", () => {
    expect(parseGoogleCallback("?error=access_denied")).toEqual({
      kind: "error",
      error: "access_denied",
    });
  });

  it("rejects a callback without a code", () => {
    expect(parseGoogleCallback("")).toEqual({ kind: "missing" });
  });

  it("exchanges a code, signs in, and clears the callback URL", async () => {
    const replaceUrl = vi.fn();
    const signIn = vi.fn();
    const exchange = vi.fn().mockResolvedValue("jwt");

    await expect(
      completeGoogleCallback("?code=opaque-code", exchange, signIn, replaceUrl),
    ).resolves.toEqual({ kind: "success" });

    expect(exchange).toHaveBeenCalledWith("opaque-code");
    expect(signIn).toHaveBeenCalledWith("jwt");
    expect(replaceUrl).toHaveBeenCalledOnce();
  });

  it("does not exchange a cancelled callback", async () => {
    const replaceUrl = vi.fn();
    const signIn = vi.fn();
    const exchange = vi.fn();

    await expect(
      completeGoogleCallback(
        "?error=access_denied",
        exchange,
        signIn,
        replaceUrl,
      ),
    ).resolves.toEqual({ kind: "error", error: "access_denied" });

    expect(exchange).not.toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
    expect(replaceUrl).toHaveBeenCalledOnce();
  });
});
