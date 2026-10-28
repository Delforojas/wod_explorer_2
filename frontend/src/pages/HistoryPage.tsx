import { useEffect, useState } from "react";

import { getAvailableWods } from "../api/wodsApi";
import { getWodResults } from "../api/wodsResultsApi";

import type { WodOrigin, WodType } from "../types/Wod";
import type { WodResultResponse } from "../types/WodResult";
import HistoryView from "../views/history/HistoryView";
import type {
  HistoryFilterValues,
  HistoryWodOption,
} from "../views/history/HistoryView.Types";

const initialFilters: HistoryFilterValues = {
  wodId: "",
  type: "",
  origin: "",
  from: "",
  to: "",
};

function toApiFilters(filters: HistoryFilterValues) {
  return {
    wodId: filters.wodId ? Number(filters.wodId) : undefined,
    type: filters.type || undefined,
    origin: filters.origin || undefined,
    from: filters.from ? `${filters.from}T00:00:00` : undefined,
    to: filters.to ? `${filters.to}T23:59:59` : undefined,
  };
}

function mergeWodOptions(
  current: HistoryWodOption[],
  incoming: HistoryWodOption[],
): HistoryWodOption[] {
  const options = new Map(current.map((wod) => [wod.id, wod]));

  incoming.forEach((wod) => {
    options.set(wod.id, wod);
  });

  return [...options.values()].sort((first, second) =>
    first.name.localeCompare(second.name),
  );
}

function HistoryPage() {
  const [results, setResults] = useState<WodResultResponse[]>([]);
  const [wods, setWods] = useState<HistoryWodOption[]>([]);
  const [filters, setFilters] = useState<HistoryFilterValues>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<HistoryFilterValues>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getWodResults(toApiFilters(appliedFilters))
      .then((data) => {
        if (active) {
          setResults(data);
          setWods((current) =>
            mergeWodOptions(
              current,
              data.map((result) => ({ id: result.wodId, name: result.wodName })),
            ),
          );
        }
      })
      .catch((cause) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "No se pudo cargar el historial",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [appliedFilters]);

  useEffect(() => {
    getAvailableWods()
      .then((data) => {
        setWods((current) =>
          mergeWodOptions(
            current,
            data.map((wod) => ({ id: wod.id, name: wod.name })),
          ),
        );
      })
      .catch(() => undefined);
  }, []);

  function handleFilterChange(
    field: keyof HistoryFilterValues,
    value: string,
  ) {
    if (field === "wodId" || field === "from" || field === "to") {
      setFilters((current) => ({ ...current, [field]: value }));
      return;
    }

    if (field === "type") {
      const type: WodType | "" =
        value === "FOR_TIME" || value === "AMRAP" || value === "EMOM"
          ? value
          : "";

      setFilters((current) => ({ ...current, type }));
      return;
    }

    const origin: WodOrigin | "" =
      value === "GENERIC" || value === "PERSONAL" ? value : "";

    setFilters((current) => ({ ...current, origin }));
  }

  function applyFilters() {
    setLoading(true);
    setError(null);
    setAppliedFilters({ ...filters });
  }

  function clearFilters() {
    setLoading(true);
    setError(null);
    setFilters(initialFilters);
    setAppliedFilters({ ...initialFilters });
  }

  return (
    <HistoryView
      results={results}
      wods={wods}
      filters={filters}
      loading={loading}
      error={error}
      onFilterChange={handleFilterChange}
      onApplyFilters={applyFilters}
      onClearFilters={clearFilters}
    />
  );
}

export default HistoryPage;
