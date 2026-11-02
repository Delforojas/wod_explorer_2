import { useEffect, useRef, useState } from "react";
import type { WodVersionResponse, WodVersionItemResponse } from "../types/Wod";
import {
  getWodVersions,
  getWodVersionById,
  getWodVersionItems,
} from "../api/wodsApi";
import WodVersionsView from "../views/wod-versions/WodVersionsView";
import { isLatestRequest } from "../utils/asyncRequest";

function WodVersionsPage() {
  const [versions, setVersions] = useState<WodVersionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVersion, setSelectedVersion] =
    useState<WodVersionResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<WodVersionItemResponse[]>(
    [],
  );
  const selectionRequest = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    let active = true;
    mounted.current = true;

    getWodVersions()
      .then((data) => {
        if (active) {
          setVersions(data);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar las versiones de los WODs");
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

  async function handleSelectVersion(id: number) {
    const requestId = ++selectionRequest.current;

    try {
      setError(null);

      const version = await getWodVersionById(id);
      const items = await getWodVersionItems();

      const versionItems = items.filter((item) => item.wodVersionId === id);

      if (!mounted.current || !isLatestRequest(requestId, selectionRequest.current)) {
        return;
      }

      setSelectedVersion(version);
      setSelectedItems(versionItems);
    } catch {
      if (mounted.current && isLatestRequest(requestId, selectionRequest.current)) {
        setError("No se pudo cargar la versión");
      }
    }
  }

  return (
    <WodVersionsView
      versions={versions}
      selectedVersion={selectedVersion}
      selectedItems={selectedItems}
      loading={loading}
      error={error}
      onSelectVersion={handleSelectVersion}
    />
  );
}

export default WodVersionsPage;
