import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { useAuth } from "../auth/useAuth";
import { getAuthErrorMessage } from "../auth/authErrors";
import { registerRequestSchema } from "../schemas/authSchemas";
import RegisterView from "../views/register/RegisterView";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isSuccess) return;

    const validation = registerRequestSchema.safeParse({
      username,
      email,
      password,
    });

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Revisa los datos del registro.",
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const token = await register(validation.data);

      signIn(token);
      setIsSuccess(true);
    } catch (cause) {
      setError(
        getAuthErrorMessage(cause, "No se ha podido completar el registro."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RegisterView
      username={username}
      email={email}
      password={password}
      onUsernameChange={setUsername}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      error={error}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
    />
  );
}

export default RegisterPage;
