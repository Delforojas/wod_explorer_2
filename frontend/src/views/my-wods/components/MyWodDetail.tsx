import WodDetailLayout from "../../../components/wodDetail/WodDetail";
import type { MyWodsViewProps } from "../MyWodsView.Types";

type MyWodDetailProps = Pick<MyWodsViewProps, "selectedWod" | "onBack">;

function MyWodDetail({ selectedWod, onBack }: MyWodDetailProps) {
  return (
    <WodDetailLayout
      selectedWod={selectedWod}
      onBack={onBack}
      eyebrow="MI ENTRENAMIENTO"
      description="Consulta la composición de tu entrenamiento."
      registrationHref={
        selectedWod ? `/my-wod-results/new?wodId=${selectedWod.id}` : undefined
      }
    />
  );
}

export default MyWodDetail;
