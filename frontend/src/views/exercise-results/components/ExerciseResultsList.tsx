import type { MyExerciseResultsViewProps } from "../MyExerciseResultsView.Types";

import ExerciseResultCard from "./ExerciseResultCard";

type ExerciseResultsListProps = Pick<
  MyExerciseResultsViewProps,
  "results" | "exercises"
>;

function ExerciseResultsList({ results, exercises }: ExerciseResultsListProps) {
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
        />
      ))}
    </div>
  );
}

export default ExerciseResultsList;
