import type { CreateWodViewProps } from "../CreateWodView.Types";

import WodConfiguration from "./WodConfiguration";
import WodExercisesList from "./WodExercisesList";

type CreateWodFormProps = Pick<
  CreateWodViewProps,
  | "exercises"
  | "name"
  | "type"
  | "rounds"
  | "timeCapSeconds"
  | "items"
  | "getExercise"
  | "onNameChange"
  | "onTypeChange"
  | "onRoundsChange"
  | "onTimeCapChange"
  | "onExerciseChange"
  | "onRepsChange"
  | "onWeightChange"
  | "onDistanceChange"
  | "onDurationChange"
  | "onAddExercise"
  | "onRemoveExercise"
  | "onSubmit"
>;

function CreateWodForm({
  exercises,
  name,
  type,
  rounds,
  timeCapSeconds,
  items,
  getExercise,
  onNameChange,
  onTypeChange,
  onRoundsChange,
  onTimeCapChange,
  onExerciseChange,
  onRepsChange,
  onWeightChange,
  onDistanceChange,
  onDurationChange,
  onAddExercise,
  onRemoveExercise,
  onSubmit,
}: CreateWodFormProps) {
  return (
    <form className="create-wod-form" onSubmit={onSubmit}>
      {/* CONFIGURACIÓN DEL WOD */}

      <WodConfiguration
        name={name}
        type={type}
        rounds={rounds}
        timeCapSeconds={timeCapSeconds}
        onNameChange={onNameChange}
        onTypeChange={onTypeChange}
        onRoundsChange={onRoundsChange}
        onTimeCapChange={onTimeCapChange}
      />

      {/* COMPOSICIÓN DEL WOD */}

      <WodExercisesList
        exercises={exercises}
        items={items}
        getExercise={getExercise}
        onExerciseChange={onExerciseChange}
        onRepsChange={onRepsChange}
        onWeightChange={onWeightChange}
        onDistanceChange={onDistanceChange}
        onDurationChange={onDurationChange}
        onAddExercise={onAddExercise}
        onRemoveExercise={onRemoveExercise}
      />

      {/* ACCIONES DEL FORMULARIO */}

      <div className="create-wod-form-actions">
        <button
          className="create-wod-form-submit"
          type="submit"
          disabled={items.length === 0}
        >
          Crear WOD
        </button>
      </div>
    </form>
  );
}

export default CreateWodForm;
