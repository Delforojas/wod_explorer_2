import type { MyExerciseResultsViewProps } from "../MyExerciseResultsView.Types";

import ExerciseResultCard from "./ExerciseResultCard";

type ExerciseResultsListProps = Pick<
  MyExerciseResultsViewProps,
  "results" | "exercises" | "deletingId" | "onDelete"
> & {
  personalBestIds: ReadonlySet<number>;
};

function ExerciseResultsList({
  results,
  exercises,
  personalBestIds,
  deletingId,
  onDelete,
}: ExerciseResultsListProps) {
  function getExerciseName(exerciseId: number): string {
    const exercise = exercises.find((item) => item.id === exerciseId);

    return exercise?.name ?? `Ejercicio #${exerciseId}`;
  }

  return (
    <div className="exercise-results-list">
      {results.map((result) => (
        <ExerciseResultCard
          key={result.id}
          result={result}
          exerciseName={getExerciseName(result.exerciseId)}
          isPersonalBest={personalBestIds.has(result.id)}
          deleting={deletingId === result.id}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ExerciseResultsList;
