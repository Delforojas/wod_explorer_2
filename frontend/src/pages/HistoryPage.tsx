import { useEffect, useState } from "react";

import { getWodResults } from "../api/wodsResultsApi";

import type { WodResultResponse } from "../types/WodResult";
import HistoryView from "../views/history/HistoryView";

function HistoryPage() {
  const [results, setResults] = useState<WodResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWodResults()
      .then((data) => {
        setResults(data);
      })
      .catch(() => {
        setError("No se pudo cargar el historial");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <HistoryView results={results} loading={loading} error={error} />
  );
}

export default HistoryPage;
