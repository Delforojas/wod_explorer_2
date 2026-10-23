import { Link } from "react-router-dom";
import type { MyWodsViewProps } from "../MyWodsView.Types";

type MyWodsListProps = Pick<
  MyWodsViewProps,
  "wods" | "onSelectWod" | "onEditWod" | "onDeleteWod"
>;

function MyWodsList({
  wods,
  onSelectWod,
  onEditWod,
  onDeleteWod,
}: MyWodsListProps) {
  return (
    <section className="wod-page my-wods-page">
      <div className="wod-container">
        {/* ENCABEZADO */}

        <header className="wod-header">
          <p className="wod-eyebrow">MIS ENTRENAMIENTOS</p>

          <h1>Mis WODs</h1>

          <p className="wod-description">
            Consulta, crea y edita tus entrenamientos personales.
          </p>
        </header>

        {/* NAVEGACIÓN */}

        <nav className="my-wods-navigation" aria-label="Acciones de mis WODs">
          <Link to="/my-wod-results" className="my-wods-nav-link">
            Resultados
          </Link>

          <Link to="/create-wod" className="my-wods-nav-link my-wods-create">
            + Crear WOD
          </Link>
        </nav>

        {/* CONTADOR */}

        <p className="wod-count">{wods.length} entrenamientos personales</p>

        {/* LISTADO */}

        {wods.length === 0 ? (
          <p className="wod-empty">Todavía no has creado ningún WOD.</p>
        ) : (
          <div className="wod-grid">
            {wods.map((wod) => (
              <article className="wod-card" key={wod.id}>
                <h2>{wod.name}</h2>

                <div className="wod-card-meta">
                  <span>{wod.version.type}</span>

                  {wod.version.timeCapSeconds != null && (
                    <span>
                      {Math.floor(wod.version.timeCapSeconds / 60)} min
                    </span>
                  )}
                </div>

                {/* ACCIONES */}

                <div className="my-wods-actions">
                  <button
                    className="wod-card-action"
                    type="button"
                    onClick={() => onSelectWod(wod.id)}
                  >
                    Ver WOD →
                  </button>

                  <button
                    className="my-wods-button"
                    type="button"
                    onClick={() => onEditWod(wod)}
                  >
                    Editar
                  </button>

                  <button
                    className="my-wods-button my-wods-delete"
                    type="button"
                    onClick={() => onDeleteWod(wod.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyWodsList;
