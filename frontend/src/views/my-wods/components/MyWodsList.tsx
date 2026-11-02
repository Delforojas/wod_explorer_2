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
        <header className="wod-header">
          <p className="wod-eyebrow">MIS ENTRENAMIENTOS</p>

          <h1>Mis WODs</h1>

          <p className="wod-description">
            Consulta, crea y edita tus entrenamientos personales.
          </p>
        </header>

        <nav className="my-wods-navigation" aria-label="Acciones de mis WODs">
          <Link
            to="/my-wod-results"
            className="my-wods-nav-link my-wods-results-link"
          >
            Resultados
          </Link>

          <Link to="/create-wod" className="my-wods-nav-link my-wods-create">
            + Crear WOD
          </Link>
        </nav>

        <p className="wod-count">{wods.length} entrenamientos personales</p>

        {wods.length === 0 ? (
          <p className="wod-empty my-wods-empty" role="status">
            Todavía no has creado ningún WOD.
          </p>
        ) : (
          <div className="my-wods-list">
            {wods.map((wod) => (
              <article className="my-wod-row" key={wod.id}>
                <div className="my-wod-content">
                  <h2>{wod.name}</h2>

                  <div className="my-wod-meta">
                    <span>{wod.version.type}</span>

                    {wod.version.timeCapSeconds != null && (
                      <span>
                        {Math.floor(wod.version.timeCapSeconds / 60)} min
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="my-wods-actions"
                  role="group"
                  aria-label={`Acciones para ${wod.name}`}
                >
                  <button
                    className="my-wods-action my-wods-view-action"
                    type="button"
                    onClick={() => onSelectWod(wod.id)}
                    aria-label={`Ver WOD ${wod.name}`}
                  >
                    Ver WOD
                  </button>

                  <button
                    className="my-wods-action"
                    type="button"
                    onClick={() => onEditWod(wod)}
                    aria-label={`Editar ${wod.name}`}
                  >
                    Editar
                  </button>

                  <button
                    className="my-wods-action my-wods-delete"
                    type="button"
                    onClick={() => onDeleteWod(wod.id)}
                    aria-label={`Eliminar ${wod.name}`}
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
