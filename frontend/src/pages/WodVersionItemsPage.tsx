import { useEffect, useRef, useState } from "react";
import type { WodVersionItemResponse, WodVersionResponse } from "../types/Wod";
import {
  getWodVersionItems,
  getWodVersionItemById,
  getWodVersions,
} from "../api/wodsApi";
import WodVersionItemsView from "../views/wod-versions/WodVersionItemsView";
import { isLatestRequest } from "../utils/asyncRequest";

function WodVersionItemsPage() {
  const [items, setItems] = useState<WodVersionItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<WodVersionResponse[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<WodVersionItemResponse | null>(null);
  const selectionRequest = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    let active = true;
    mounted.current = true;

    Promise.all([getWodVersionItems(), getWodVersions()])
      .then(([itemsData, versionsData]) => {
        if (active) {
          setItems(itemsData);
          setVersions(versionsData);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar los elementos de los WODs");
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

  async function handleSelectItem(id: number) {
    const requestId = ++selectionRequest.current;

    try {
      setError(null);

      const item = await getWodVersionItemById(id);

      if (!mounted.current || !isLatestRequest(requestId, selectionRequest.current)) {
        return;
      }

      setSelectedItem(item);
    } catch {
      if (mounted.current && isLatestRequest(requestId, selectionRequest.current)) {
        setError("No se pudo cargar el elemento");
      }
    }
  }

  return (
    <WodVersionItemsView
      items={items}
      versions={versions}
      selectedItem={selectedItem}
      loading={loading}
      error={error}
      onSelectItem={handleSelectItem}
    />
  );
}

export default WodVersionItemsPage;
