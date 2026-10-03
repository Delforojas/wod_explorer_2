import { useEffect, useState } from "react";
import type { WodVersionResponse, WodVersionItemResponse } from "../types/Wod";
import {
  getWodVersions,
  getWodVersionById,
  getWodVersionItems,
} from "../api/wodsApi";
import WodVersionsView from "../views/wod-versions/WodVersionsView";

function WodVersionsPage() {
  const [versions, setVersions] = useState<WodVersionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVersion, setSelectedVersion] =
    useState<WodVersionResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<WodVersionItemResponse[]>(
    [],
  );
  useEffect(() => {
    getWodVersions()
      .then((data) => {
        setVersions(data);
      })
      .catch(() => {
        setError("No se pudieron cargar las versiones de los WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSelectVersion(id: number) {
    try {
      setError(null);

      const version = await getWodVersionById(id);
      const items = await getWodVersionItems();

      const versionItems = items.filter((item) => item.wodVersionId === id);

      setSelectedVersion(version);
      setSelectedItems(versionItems);
    } catch {
      setError("No se pudo cargar la versión");
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
