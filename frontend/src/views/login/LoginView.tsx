import { Link } from "react-router-dom";
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
    <section className="login-page">
      <div className="login-card">
        {/* Logotipo */}
        <div className="login-logo">
          <span>WE</span>
        </div>

        {/* Encabezado */}
        <div className="login-header">
          <p className="login-eyebrow">WOD EXPLORER 2.0</p>
          <h1>Iniciar sesión</h1>
          <p className="login-description">
            Accede a tus entrenamientos, registra tus resultados y supera tus
            marcas.
          </p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-field">
            <label htmlFor="username">Nombre de usuario</label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Introduce tu usuario"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Introduce tu contraseña"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </div>

          <button className="login-submit" type="submit">
            Iniciar sesión
          </button>
        </form>

        {/* Separador */}
        <div className="login-divider">
          <span>o continúa con</span>
        </div>

        {/* Google OAuth */}
        <button className="login-google" type="button" onClick={onGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.89 46.98 24.55z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.91 23.91 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Continuar con Google
        </button>

        {/* Registro */}
        <p className="login-register">
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate gratis</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginView;
