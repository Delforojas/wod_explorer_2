import { useEffect, useState } from "react";
import { getWods } from "../api/wodsApi";
import type { Wod } from "../types/Wod";

function WodsPage() {
  const [wods, setWods] = useState<Wod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWods()
      .then((data) => {
        setWods(data);
      })
      .catch(() => {
        setError("No se pudieron cargar los WODs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando WODs...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>WODs</h1>

      {wods.map((wod) => (
        <p key={wod.id}>{wod.name}</p>
      ))}
    </section>
  );
}

export default WodsPage;
