import MyWodsView from "../views/my-wods/MyWodsView";
import { useMyWods } from "../views/my-wods/useMyWods";

function MyWodsPage() {
  const {
    wods,
    exercises,
    selectedWod,
    editingWod,
    editName,
    editType,
    editRounds,
    editTimeCapSeconds,
    editItems,
    loading,
    submitting,
    deletingId,
    error,
    getExercise,
    onSelectWod,
    onEditWod,
    onDeleteWod,
    onCancelEdit,
    onEditNameChange,
    onEditTypeChange,
    onEditRoundsChange,
    onEditTimeCapChange,
    onEditExerciseChange,
    onEditRepsChange,
    onEditWeightChange,
    onEditDistanceChange,
    onEditDurationChange,
    onAddEditExercise,
    onRemoveEditExercise,
    onUpdateWod,
    onBack,
  } = useMyWods();

  return (
    <MyWodsView
      wods={wods}
      exercises={exercises}
      selectedWod={selectedWod}
      editingWod={editingWod}
      editName={editName}
      editType={editType}
      editRounds={editRounds}
      editTimeCapSeconds={editTimeCapSeconds}
      editItems={editItems}
      loading={loading}
      submitting={submitting}
      deletingId={deletingId}
      error={error}
      getExercise={getExercise}
      onSelectWod={onSelectWod}
      onEditWod={onEditWod}
      onDeleteWod={onDeleteWod}
      onCancelEdit={onCancelEdit}
      onEditNameChange={onEditNameChange}
      onEditTypeChange={onEditTypeChange}
      onEditRoundsChange={onEditRoundsChange}
      onEditTimeCapChange={onEditTimeCapChange}
      onEditExerciseChange={onEditExerciseChange}
      onEditRepsChange={onEditRepsChange}
      onEditWeightChange={onEditWeightChange}
      onEditDistanceChange={onEditDistanceChange}
      onEditDurationChange={onEditDurationChange}
      onAddEditExercise={onAddEditExercise}
      onRemoveEditExercise={onRemoveEditExercise}
      onUpdateWod={onUpdateWod}
      onBack={onBack}
    />
  );
}

export default MyWodsPage;
