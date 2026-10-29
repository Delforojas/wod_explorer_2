import { useEffect, useState } from "react";
import { login } from "../api/authApi";
import { GOOGLE_OAUTH_URL } from "../api/client/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getAuthErrorMessage } from "../auth/authErrors";
import { loginRequestSchema } from "../schemas/authSchemas";
import LoginView from "../views/login/LoginView";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [isSuccess, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isSuccess) {
      return;
    }

    const validation = loginRequestSchema.safeParse({
      username,
      password,
    });

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ??
          "Revisa los datos de inicio de sesión.",
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const token = await login(validation.data);

      signIn(token);
      setIsSuccess(true);
    } catch (cause) {
      setError(
        getAuthErrorMessage(cause, "No se ha podido iniciar sesión."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    window.location.assign(GOOGLE_OAUTH_URL);
  }

  return (
    <LoginView
      username={username}
      password={password}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      error={error}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
    />
  );
}

export default LoginPage;
