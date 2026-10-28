import { useEffect, useState } from "react";

import { deleteWodResult, getWodResults } from "../api/wodsResultsApi";

import type { WodResultResponse } from "../types/WodResult";
import MyWodResultsView from "../views/wod-results/MyWodResultsView";

function MyWodResultsPage() {
  const [results, setResults] = useState<WodResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getWodResults()
      .then((data) => {
        setResults(data);
      })
      .catch((cause) => {
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudieron cargar los resultados de tus WODs",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("¿Quieres eliminar este resultado?")) {
      return;
    }

    setError(null);
    setDeletingId(id);

    try {
      await deleteWodResult(id);
      setResults((current) => current.filter((result) => result.id !== id));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar el resultado del WOD",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <MyWodResultsView
      results={results}
      loading={loading}
      error={error}
      deletingId={deletingId}
      onDelete={handleDelete}
    />
  );
}

export default MyWodResultsPage;
