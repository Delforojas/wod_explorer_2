import type { MyWodsViewProps } from "./MyWodsView.Types";

import MyWodsList from "./components/MyWodsList";
import MyWodDetail from "./components/MyWodDetail";
import MyWodEditForm from "./components/MyWodEditForm";

function MyWodsView(props: MyWodsViewProps) {
  const { loading, error, editingWod, selectedWod } = props;

  if (loading) {
    return (
      <section className="wod-page my-wods-state-page">
        <p className="wod-empty" role="status">
          Cargando tus WODs...
        </p>
      </section>
    );
  }

  if (editingWod) {
    return <MyWodEditForm {...props} />;
  }

  if (error) {
    return (
      <section className="wod-page my-wods-state-page">
        <p className="wod-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (selectedWod) {
    return <MyWodDetail {...props} />;
  }

  return <MyWodsList {...props} />;
}

export default MyWodsView;
