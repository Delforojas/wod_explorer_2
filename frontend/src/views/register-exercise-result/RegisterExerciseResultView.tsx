import type { RegisterExerciseResultViewProps } from "./RegisterExerciseResultView.Types";

import ExerciseResultForm from "./components/ExerciseResultForm";

function RegisterExerciseResultView(props: RegisterExerciseResultViewProps) {
  const { loading, error, success } = props;

  if (loading) {
    return (
      <section className="register-result-page">
        <p className="register-result-loading" role="status">
          Cargando ejercicios...
        </p>
      </section>
    );
  }

  return (
    <section className="register-result-page">
      <div className="register-result-container">
        <header className="register-result-header">
          <p className="register-result-eyebrow">Seguimiento personal</p>

          <h1>Registrar marca</h1>

          <p className="register-result-description">
            Registra un nuevo resultado para uno de tus ejercicios.
          </p>
        </header>

        <ExerciseResultForm {...props} />

        {error && (
          <p className="register-result-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="register-result-success" role="status">
            {success}
          </p>
        )}
      </div>
    </section>
  );
}

export default RegisterExerciseResultView;
