import type { WodResultResponse } from "../../types/WodResult";
import {
  formatWodOrigin,
  formatWodResultDate,
  formatWodType,
  getWodResultLines,
} from "../wod-results/resultPresentation";

interface PersonalBestsViewProps {
  results: WodResultResponse[];
  loading: boolean;
  error: string | null;
}

function PersonalBestsView({
  results,
  loading,
  error,
}: PersonalBestsViewProps) {
  if (loading) {
    return (
      <section className="page personal-bests-page">
        <header className="page-header">
          <p className="page-eyebrow">Rendimiento</p>
          <h1>Mejores marcas</h1>
        </header>
        <p className="ui-loading" role="status">
          Cargando tus mejores marcas...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page personal-bests-page">
        <header className="page-header">
          <p className="page-eyebrow">Rendimiento</p>
          <h1>Mejores marcas</h1>
        </header>
        <p className="ui-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="page personal-bests-page">
      <header className="page-header">
        <p className="page-eyebrow">Rendimiento</p>
        <h1>Mejores marcas</h1>
        <p>Una marca derivada por versión y modalidad.</p>
      </header>

      {results.length === 0 ? (
        <p className="ui-empty">
          Todavía no tienes mejores marcas de WOD registradas.
        </p>
      ) : (
        <div className="personal-bests-list">
          {results.map((result) => (
            <article className="personal-best-card" key={result.id}>
              <header className="personal-best-card-header">
                <div>
                  <p className="personal-best-label">Mejor marca</p>
                  <h2>{result.wodName}</h2>
                </div>
                <strong>{getWodResultLines(result)[0]}</strong>
              </header>

              <div className="personal-best-meta">
                <span>{formatWodType(result.type)}</span>
                <span>{formatWodOrigin(result.origin)}</span>
                <span>Versión ID {result.wodVersionId}</span>
                <time dateTime={result.performedAt}>
                  {formatWodResultDate(result.performedAt)}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default PersonalBestsView;
