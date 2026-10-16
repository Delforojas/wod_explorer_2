import type { MyWodResultsViewProps } from "../MyWodResultsView.Types";

import WodResultCard from "./WodResultCard";

type WodResultsListProps = Pick<MyWodResultsViewProps, "results">;

function WodResultsList({ results }: WodResultsListProps) {
  return (
    <>
      {/* CONTADOR */}

      <p className="wod-count">{results.length} resultados registrados</p>

      {/* LISTADO */}

      <div className="wod-grid">
        {results.map((result) => (
          <WodResultCard key={result.id} result={result} />
        ))}
      </div>
    </>
  );
}

export default WodResultsList;
