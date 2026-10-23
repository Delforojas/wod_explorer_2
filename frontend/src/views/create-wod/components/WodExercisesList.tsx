import type { CreateWodViewProps } from "../CreateWodView.Types";

import WodExerciseCard from "./WodExerciseCard";

type WodExercisesListProps = Pick<
  CreateWodViewProps,
  | "exercises"
  | "items"
  | "getExercise"
  | "onExerciseChange"
  | "onRepsChange"
  | "onWeightChange"
  | "onDistanceChange"
  | "onDurationChange"
  | "onAddExercise"
  | "onRemoveExercise"
>;

function WodExercisesList({
  exercises,
  items,
  getExercise,
  onExerciseChange,
  onRepsChange,
  onWeightChange,
  onDistanceChange,
  onDurationChange,
  onAddExercise,
  onRemoveExercise,
}: WodExercisesListProps) {
  return (
    <section
      className="wod-exercises-list"
      aria-labelledby="wod-exercises-title"
    >
      {/* ENCABEZADO */}

      <header className="wod-exercises-header">
        <div className="wod-exercises-heading">
          <span className="wod-exercises-eyebrow">COMPOSICIÓN DEL WOD</span>

          <h2 id="wod-exercises-title">Ejercicios</h2>

          <p>Selecciona los movimientos y configura sus cantidades.</p>
        </div>

        {/* CONTADOR */}

        <span className="wod-exercises-count">
          {items.length} {items.length === 1 ? "ejercicio" : "ejercicios"}
        </span>
      </header>

      {/* ESTADO VACÍO */}

      {items.length === 0 && (
        <div className="wod-exercises-empty">
          <span className="wod-exercises-empty-icon" aria-hidden="true">
            +
          </span>

          <p>Todavía no has añadido ejercicios.</p>

          <span>
            Añade tu primer movimiento para empezar a construir el WOD.
          </span>
        </div>
      )}

      {/* LISTADO DE EJERCICIOS */}

      {items.length > 0 && (
        <div className="wod-exercises-grid">
          {items.map((item, index) => (
            <WodExerciseCard
              key={index}
              item={item}
              index={index}
              total={items.length}
              exercises={exercises}
              exercise={getExercise(item.exerciseId)}
              onExerciseChange={onExerciseChange}
              onRepsChange={onRepsChange}
              onWeightChange={onWeightChange}
              onDistanceChange={onDistanceChange}
              onDurationChange={onDurationChange}
              onRemoveExercise={onRemoveExercise}
            />
          ))}
        </div>
      )}

      {/* AÑADIR EJERCICIO */}

      <button
        className="wod-exercises-add"
        type="button"
        onClick={onAddExercise}
        disabled={exercises.length === 0}
      >
        <span aria-hidden="true">+</span>
        Añadir ejercicio
      </button>
    </section>
  );
}

export default WodExercisesList;
