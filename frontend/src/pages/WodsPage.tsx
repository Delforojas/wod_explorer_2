import { useEffect, useState } from "react";
import type { WodAggregateResponse } from "../types/Wod";
import { getWods, getWodById } from "../api/wodsApi";
import WodsView from "../views/wods/WodsView";

function WodsPage() {
  const [wods, setWods] = useState<WodAggregateResponse[]>([]);
  const [selectedWod, setSelectedWod] = useState<WodAggregateResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWods()
      .then((data) => {
        console.log("WODs recibidos:", data);
        setWods(data);
      })
      .catch(() => {
        setError("No se pudieron cargar los WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSelectWod(id: number) {
    try {
      setError(null);

      const wod = await getWodById(id);

      setSelectedWod(wod);
    } catch {
      setError("No se pudo cargar el WOD");
    }
  }

  function handleBack() {
    setSelectedWod(null);
  }

  return (
    <WodsView
      wods={wods}
      selectedWod={selectedWod}
      loading={loading}
      error={error}
      onSelectWod={handleSelectWod}
      onBack={handleBack}
    />
  );
}

export default WodsPage;
