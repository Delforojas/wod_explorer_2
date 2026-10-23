import type { MyWodsViewProps } from "./MyWodsView.Types";

import MyWodsList from "./components/MyWodsList";
import MyWodDetail from "./components/MyWodDetail";
import MyWodEditForm from "./components/MyWodEditForm";

function MyWodsView(props: MyWodsViewProps) {
  const { loading, error, editingWod, selectedWod } = props;

  if (loading) {
    return (
      <p className="ui-loading" role="status">
        Cargando tus WODs...
      </p>
    );
  }

  if (error) {
    return (
      <p className="ui-error" role="alert">
        {error}
      </p>
    );
  }

  if (editingWod) {
    return <MyWodEditForm {...props} />;
  }

  if (selectedWod) {
    return <MyWodDetail {...props} />;
  }

  return <MyWodsList {...props} />;
}

export default MyWodsView;
