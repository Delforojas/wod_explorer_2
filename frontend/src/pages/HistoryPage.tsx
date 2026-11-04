import HistoryView from "../views/history/HistoryView";
import { useHistory } from "../views/history/useHistory";

function HistoryPage() {
  const {
    entries,
    mode,
    filters,
    appliedFilters,
    dateFiltersOpen,
    dateFiltersMounted,
    wodLoading,
    exerciseLoading,
    wodError,
    exerciseError,
    onFilterChange,
    onModeChange,
    onToggleDateFilters,
    onDateFiltersAnimationEnd,
    onApplyFilters,
    onClearFilters,
    onRetryWods,
    onRetryExercises,
  } = useHistory();

  return (
    <HistoryView
      entries={entries}
      mode={mode}
      filters={filters}
      appliedFilters={appliedFilters}
      dateFiltersOpen={dateFiltersOpen}
      dateFiltersMounted={dateFiltersMounted}
      wodLoading={wodLoading}
      exerciseLoading={exerciseLoading}
      wodError={wodError}
      exerciseError={exerciseError}
      onFilterChange={onFilterChange}
      onModeChange={onModeChange}
      onToggleDateFilters={onToggleDateFilters}
      onDateFiltersAnimationEnd={onDateFiltersAnimationEnd}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      onRetryWods={onRetryWods}
      onRetryExercises={onRetryExercises}
    />
  );
}

export default HistoryPage;
