import type { WodsViewProps } from "./WodsView.Types";
import WodsList from "../../components/wodFilter/WodsList";
import WodDetail from "../../components/wodFilter/WodDetail";

function WodsView(props: WodsViewProps) {
  const { loading, error, selectedWod } = props;

  if (loading) {
    return (
      <section className="wod-page">
        <p className="wod-empty" role="status">
          Cargando WODs...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="wod-page">
        <p className="wod-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (selectedWod) {
    return <WodDetail selectedWod={selectedWod} onBack={props.onBack} />;
  }

  return <WodsList wods={props.wods} onSelectWod={props.onSelectWod} />;
}

export default WodsView;
