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
    <article className="wod-card my-wod-result-card">
      <h2>{result.wodName}</h2>

      <div className="wod-card-meta">
        <span>{formatWodType(result.type)}</span>
        <span>{formatWodOrigin(result.origin)}</span>
        <span>Versión ID {result.wodVersionId}</span>
      </div>

      <p className="my-wod-result-date">
        {formatWodResultDate(result.performedAt)}
      </p>

      <div className="my-wod-result-content">{renderResult()}</div>

      <button
        type="button"
        className="my-wod-result-delete"
        disabled={deleting}
        onClick={() => onDelete(result.id)}
        aria-label={`Eliminar resultado de ${result.wodName}`}
      >
        {deleting ? "Eliminando..." : "Eliminar resultado"}
      </button>
    </article>
  );
}

export default WodResultCard;
