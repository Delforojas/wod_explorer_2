import { useEffect, useState } from "react";
import type { WodVersionItemResponse, WodVersionResponse } from "../types/Wod";
import {
  getWodVersionItems,
  getWodVersionItemById,
  getWodVersions,
} from "../api/wodsApi";
import WodVersionItemsView from "../views/wod-versions/WodVersionItemsView";

function WodVersionItemsPage() {
  const [items, setItems] = useState<WodVersionItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<WodVersionResponse[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<WodVersionItemResponse | null>(null);

  useEffect(() => {
    Promise.all([getWodVersionItems(), getWodVersions()])
      .then(([itemsData, versionsData]) => {
        setItems(itemsData);
        setVersions(versionsData);
      })
      .catch(() => {
        setError("No se pudieron cargar los elementos de los WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSelectItem(id: number) {
    try {
      setError(null);

      const item = await getWodVersionItemById(id);

      setSelectedItem(item);
    } catch {
      setError("No se pudo cargar el elemento");
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
