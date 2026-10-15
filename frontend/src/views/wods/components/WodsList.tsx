import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import type { WodsViewProps } from "../WodsView.Types";
import type { WodAggregateResponse } from "../../../types/Wod";

type WodsListProps = Pick<WodsViewProps, "wods" | "onSelectWod">;

function formatWodType(type: WodAggregateResponse["version"]["type"]) {
  return type === "FOR_TIME" ? "For Time" : type === "AMRAP" ? "AMRAP" : "EMOM";
}

function WodsList({ wods, onSelectWod }: WodsListProps) {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const [search, setSearch] = useState("");

  const filteredWods = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return wods;
    }

    return wods.filter((wod) => wod.name.toLowerCase().includes(query));
  }, [wods, search]);

  return (
    <section className="wod-page">
      <div className="wod-container">
        {/* ENCABEZADO */}

        <header className="wod-header">
          <h1>WODs</h1>

          <p className="wod-description">
            Explora distintos entrenamientos y encuentra el que te apetezca
            hacer hoy.
          </p>
        </header>

        {/* BUSCADOR */}

        <div className="wod-search">
          <label htmlFor="wod-search-input">Buscar WODs</label>

          <input
            id="wod-search-input"
            type="search"
            placeholder="Buscar WOD..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoComplete="off"
          />
        </div>

        {/* CONTADOR */}

        <p className="wod-count">
          {search.trim()
            ? `${filteredWods.length} de ${wods.length} entrenamientos`
            : `${wods.length} entrenamientos disponibles`}
        </p>

        {/* LISTADO */}

        {filteredWods.length === 0 ? (
          <p className="wod-empty">
            {wods.length === 0
              ? "No hay entrenamientos disponibles."
              : "No se encontraron entrenamientos con ese nombre."}
          </p>
        ) : (
          <div className="wod-grid">
            {filteredWods.map((wod) => (
              <article className="wod-card" key={wod.id}>
                {/* NOMBRE */}

                <h2>{wod.name}</h2>

                {/* METADATOS */}

                <div className="wod-card-meta">
                  <span>{formatWodType(wod.version.type)}</span>

                  {wod.version.timeCapSeconds != null && (
                    <span>
                      {Math.floor(wod.version.timeCapSeconds / 60)} min
                    </span>
                  )}
                </div>

                {/* ACCIONES */}

                <div className="wod-card-actions">
                  {/* VER WOD */}

                  <button
                    className="wod-card-action"
                    type="button"
                    onClick={() => onSelectWod(wod.id)}
                    aria-label={`Abrir entrenamiento ${wod.name}`}
                  >
                    Ver →
                  </button>

                  {/* REGISTRAR RESULTADO */}

                  {isAuthenticated && (
                    <Link
                      to={`/my-wod-results/new?wodId=${wod.id}`}
                      className="wod-card-action wod-card-register"
                      aria-label={`Registrar resultado de ${wod.name}`}
                    >
                      Registrar resultado →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WodsList;
