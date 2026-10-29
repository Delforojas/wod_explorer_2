import type { RegisterViewProps } from "./RegisterView.Types";
import { Link } from "react-router-dom";

function RegisterView({
  username,
  email,
  password,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  error,
  isSubmitting,
  isSuccess,
}: RegisterViewProps) {
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
          <h1>Crear cuenta</h1>
          <p className="login-description">
            Únete a WOD Explorer, registra tus entrenamientos y supera tus
            marcas personales.
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
              placeholder="Elige tu nombre de usuario"
              autoComplete="username"
              required
              maxLength={50}
              disabled={isSubmitting || isSuccess}
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Introduce tu correo electrónico"
              autoComplete="email"
              required
              maxLength={254}
              disabled={isSubmitting || isSuccess}
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              disabled={isSubmitting || isSuccess}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </div>

          {/* Errores */}
          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}

          {isSuccess && (
            <p role="status" className="auth-success">
              Cuenta creada. Redirigiendo...
            </p>
          )}

          {/* Botón de registro */}
          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting || isSuccess}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Enlace al login */}
        <p className="login-register">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterView;
