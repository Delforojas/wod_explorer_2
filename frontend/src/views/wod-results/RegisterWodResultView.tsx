import { Link } from "react-router-dom";

import MyWodsNavigation from "../../components/layout/MyWodsNavigation";

import type { RegisterWodResultViewProps } from "./RegisterWodResultView.Types";

import WodResultForm from "./components/WodResultForm";

function RegisterWodResultView(props: RegisterWodResultViewProps) {
  const { wods, loading, error } = props;

  return (
    <section className="wod-page register-wod-result-page">
      <div className="wod-container register-wod-result-container">
        {/* ENCABEZADO */}

        <header className="wod-header register-wod-result-header">
          <p className="wod-eyebrow">MIS ENTRENAMIENTOS</p>

          <h1>Registrar resultado</h1>

          <p className="wod-description">
            Selecciona un WOD y registra el resultado de tu entrenamiento.
          </p>
        </header>

        {/* NAVEGACIÓN */}

        <div className="register-wod-result-navigation">
          <MyWodsNavigation />
        </div>

        {/* CONTENIDO */}

        <div className="register-wod-result-content">
          {loading ? (
            <p className="wod-empty register-wod-result-status" role="status">
              Cargando entrenamientos...
            </p>
          ) : (
            <>
              {error && (
                <p className="wod-error register-wod-result-error" role="alert">
                  {error}
                </p>
              )}

              {wods.length === 0 ? (
                <div className="register-wod-result-empty">
                  <span
                    className="register-wod-result-empty-icon"
                    aria-hidden="true"
                  >
                    +
                  </span>

                  <h2>Empieza creando tu primer WOD</h2>

                  <p>
                    No hay WODs disponibles para registrar resultados en este
                    momento.
                  </p>

                  <Link to="/create-wod" className="register-wod-result-create">
                    + Crear WOD
                  </Link>
                </div>
              ) : (
                <WodResultForm {...props} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default RegisterWodResultView;
