export type GoogleCallbackParams =
  | { kind: "code"; code: string }
  | { kind: "error"; error: string }
  | { kind: "missing" };

type GoogleCallbackCompletion =
  | GoogleCallbackParams
  | { kind: "success" };

export function parseGoogleCallback(search: string): GoogleCallbackParams {
  const params = new URLSearchParams(search);
  const error = params.get("error");

  if (error) {
    return { kind: "error", error };
  }

  const code = params.get("code");

  if (!code) {
    return { kind: "missing" };
  }

  return { kind: "code", code };
}

export async function completeGoogleCallback(
  search: string,
  exchange: (code: string) => Promise<string>,
  signIn: (token: string) => void,
  replaceUrl: () => void,
): Promise<GoogleCallbackCompletion> {
  const callback = parseGoogleCallback(search);
  replaceUrl();

  if (callback.kind !== "code") {
    return callback;
  }

  const token = await exchange(callback.code);
  signIn(token);

  return { kind: "success" };
}
