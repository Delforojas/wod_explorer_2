import { useAuth } from "../../auth/useAuth";
import type { WodsViewProps } from "../../views/wods/WodsView.Types";
import WodDetailLayout from "../wodDetail/WodDetail";

type WodDetailProps = Pick<WodsViewProps, "selectedWod" | "onBack">;

function WodDetail({ selectedWod, onBack }: WodDetailProps) {
  const { isAuthenticated } = useAuth();

  return (
    <WodDetailLayout
      selectedWod={selectedWod}
      onBack={onBack}
      eyebrow="ENTRENAMIENTO"
      description="Consulta la composición de este entrenamiento."
      registrationHref={
        isAuthenticated && selectedWod
          ? `/my-wod-results/new?wodId=${selectedWod.id}`
          : undefined
      }
    />
  );
}

export default WodDetail;
