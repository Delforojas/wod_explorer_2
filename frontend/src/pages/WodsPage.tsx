import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { WodAggregateResponse } from "../types/Wod";
import { getWods, getWodById } from "../api/wodsApi";
import WodsView from "../views/wods/WodsView";
import { isLatestRequest } from "../utils/asyncRequest";

function WodsPage() {
  const [searchParams] = useSearchParams();
  const [wods, setWods] = useState<WodAggregateResponse[]>([]);
  const [selectedWod, setSelectedWod] = useState<WodAggregateResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectionRequest = useRef(0);
  const mounted = useRef(true);
  const selectedWodId = Number(searchParams.get("wodId"));

  useEffect(() => {
    let active = true;
    mounted.current = true;

    getWods()
      .then((data) => {
        if (active) {
          setWods(data);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar los WODs");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!Number.isInteger(selectedWodId) || selectedWodId <= 0) {
      return;
    }

    handleSelectWod(selectedWodId);
  }, [selectedWodId]);

  async function handleSelectWod(id: number) {
    const requestId = ++selectionRequest.current;

    try {
      setError(null);

      const wod = await getWodById(id);

      if (!mounted.current || !isLatestRequest(requestId, selectionRequest.current)) {
        return;
      }

      setSelectedWod(wod);
    } catch {
      if (mounted.current && isLatestRequest(requestId, selectionRequest.current)) {
        setError("No se pudo cargar el WOD");
      }
    }
  }

  function handleBack() {
    selectionRequest.current += 1;
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
