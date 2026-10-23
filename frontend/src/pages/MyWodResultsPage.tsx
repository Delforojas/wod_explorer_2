import { useEffect, useState } from "react";

import { getWodResults } from "../api/wodsResultsApi";

import type { WodResultResponse } from "../types/WodResult";
import MyWodResultsView from "../views/wod-results/MyWodResultsView";

function MyWodResultsPage() {
  const [results, setResults] = useState<WodResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWodResults()
      .then((data) => {
        setResults(data);
      })
      .catch(() => {
        setError("No se pudieron cargar los resultados de tus WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <MyWodResultsView results={results} loading={loading} error={error} />;
}

export default MyWodResultsPage;
