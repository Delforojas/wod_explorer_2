import { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import LoginView from "../views/login/LoginView";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = await login({
      username,
      password,
    });

    localStorage.setItem("token", token);

    navigate("/");
  }

  function handleGoogleLogin() {
    window.location.assign(
      "http://localhost:8080/oauth2/authorization/google",
    );
  }

  return (
    <LoginView
      username={username}
      password={password}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}

export default LoginPage;
