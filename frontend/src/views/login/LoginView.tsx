import type { FormEvent } from "react";

interface LoginViewProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: () => void;
}

function LoginView({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onGoogleLogin,
}: LoginViewProps) {
  return (
    <section>
      <h1>Iniciar sesión</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
          />
        </div>

        <button type="submit">Iniciar sesión</button>
      </form>

      <p>o</p>

      <button type="button" onClick={onGoogleLogin}>
        Continuar con Google
      </button>
    </section>
  );
}

export default LoginView;
