import type { WodResultResponse } from "../../../types/WodResult";
import {
  formatWodOrigin,
  formatWodResultDate,
  formatWodType,
  getWodResultLines,
} from "../resultPresentation";

interface WodResultCardProps {
  result: WodResultResponse;
  deleting: boolean;
  onDelete: (id: number) => void;
}

function WodResultCard({ result, deleting, onDelete }: WodResultCardProps) {
  const resultLines = getWodResultLines(result);

  function renderResult() {
    return (
      <div className="my-wod-result-progress">
        {resultLines.map((line, index) => (
          <p
            className={index === 0 ? "my-wod-result-value" : "my-wod-result-meta"}
            key={`${line}-${index}`}
          >
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <article className="resource-row my-wod-result-row">
      <header className="my-wod-result-row-header">
        <div className="my-wod-result-identity">
          <h2>{result.wodName}</h2>

          <div className="resource-meta">
            <span>{formatWodType(result.type)}</span>
            <span>{formatWodOrigin(result.origin)}</span>
          </div>
        </div>

        {renderResult()}
      </header>

      <footer className="my-wod-result-row-footer">
        <time className="resource-meta" dateTime={result.performedAt}>
          {formatWodResultDate(result.performedAt)}
        </time>

        <button
          type="button"
          className="row-action my-wod-result-delete"
          disabled={deleting}
          onClick={() => onDelete(result.id)}
          aria-label={`Eliminar resultado de ${result.wodName}`}
        >
          {deleting ? "Eliminando..." : "Eliminar resultado"}
        </button>
      </footer>
    </article>
  );
}

export default WodResultCard;
