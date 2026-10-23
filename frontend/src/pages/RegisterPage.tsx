import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import RegisterView from "../views/register/RegisterView";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const token = await register({
        username,
        email,
        password,
      });

      localStorage.setItem("token", token);

      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se ha podido completar el registro.",
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
    />
  );
}

export default RegisterPage;
