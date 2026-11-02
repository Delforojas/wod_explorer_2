import type { WodsViewProps } from "../../views/wods/WodsView.Types";
import WodDetailLayout from "../wodDetail/WodDetail";

type WodDetailProps = Pick<WodsViewProps, "selectedWod" | "onBack">;

function WodDetail({ selectedWod, onBack }: WodDetailProps) {
  return (
    <WodDetailLayout
      selectedWod={selectedWod}
      onBack={onBack}
      eyebrow="ENTRENAMIENTO"
      description="Consulta la composición de este entrenamiento."
    />
  );
}

export default WodDetail;
