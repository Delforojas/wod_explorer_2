import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeGoogleCode } from "../api/authApi";
import { getAuthErrorMessage } from "../auth/authErrors";
import { useAuth } from "../auth/useAuth";
import { completeGoogleCallback, parseGoogleCallback } from "../utils/googleCallback";

type CallbackState = "loading" | "success" | "error";

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const processedRef = useRef(false);
  const initialCallback = parseGoogleCallback(window.location.search);
  const [state, setState] = useState<CallbackState>(
    initialCallback.kind === "code" ? "loading" : "error",
  );
  const [error, setError] = useState<string | null>(
    initialCallback.kind === "error"
      ? "No se ha podido completar el acceso con Google."
      : initialCallback.kind === "missing"
        ? "Falta el código de acceso de Google."
        : null,
  );

  useEffect(() => {
    if (processedRef.current) {
      return;
    }

    processedRef.current = true;
    async function completeLogin() {
      try {
        const result = await completeGoogleCallback(
          window.location.search,
          exchangeGoogleCode,
          signIn,
          () => window.history.replaceState({}, document.title, window.location.pathname),
        );

        if (result.kind === "success") {
          setState("success");
          window.setTimeout(() => navigate("/", { replace: true }), 600);
        }
      } catch (cause) {
        setState("error");
        setError(
          getAuthErrorMessage(
            cause,
            "No se ha podido completar el acceso con Google.",
          ),
        );
      }
    }

    void completeLogin();
  }, [navigate, signIn]);

  if (state === "success") {
    return (
      <section className="page placeholder-page">
        <header className="page-header">
          <p className="page-eyebrow">Acceso</p>
          <h1>Sesión iniciada</h1>
        </header>
        <p className="ui-success">Ya puedes continuar en WOD Explorer.</p>
      </section>
    );
  }

  if (state === "error") {
    return (
      <section className="page placeholder-page" role="alert">
        <header className="page-header">
          <p className="page-eyebrow">Acceso</p>
          <h1>No se pudo iniciar sesión</h1>
        </header>
        <p className="ui-error">{error}</p>
        <button type="button" onClick={() => navigate("/login", { replace: true })}>
          Volver al inicio de sesión
        </button>
      </section>
    );
  }

  return (
    <section className="page placeholder-page">
      <header className="page-header">
        <p className="page-eyebrow">Acceso</p>
        <h1>Iniciando sesión con Google</h1>
      </header>
      <p className="ui-loading" role="status" aria-live="polite">
        Estamos validando tu acceso.
      </p>
    </section>
  );
}

export default GoogleCallbackPage;
