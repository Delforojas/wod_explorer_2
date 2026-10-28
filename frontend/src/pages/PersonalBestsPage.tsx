import { useEffect, useState } from "react";

import { getPersonalBests } from "../api/wodsResultsApi";
import type { WodResultResponse } from "../types/WodResult";
import PersonalBestsView from "../views/personal-bests/PersonalBestsView";

function PersonalBestsPage() {
  const [results, setResults] = useState<WodResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPersonalBests()
      .then(setResults)
      .catch((cause) => {
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudieron cargar tus mejores marcas",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PersonalBestsView
      results={results}
      loading={loading}
      error={error}
    />
  );
}

export default PersonalBestsPage;
