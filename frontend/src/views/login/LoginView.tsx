import type { LoginViewProps } from "./LoginView.Types";

function LoginView({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onGoogleLogin,
}: LoginViewProps) {
  return (
    <section className="page auth-page">
      <header className="page-header">
        <p className="page-eyebrow">WOD Explorer</p>
        <h1>Iniciar sesión</h1>
      </header>

      <form className="form-layout" onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
          />
        </div>

        <div className="form-field">
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

      <p className="auth-separator">o</p>

      <button type="button" onClick={onGoogleLogin}>
        Continuar con Google
      </button>
    </section>
  );
}

export default LoginView;
