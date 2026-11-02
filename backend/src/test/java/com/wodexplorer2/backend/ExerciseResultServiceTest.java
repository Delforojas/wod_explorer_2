package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;

import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.ExerciseResult;
import com.wodexplorer2.backend.entity.MeasurementType;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.mapper.ExerciseResultMapper;
import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.repository.ExerciseResultRepository;
import com.wodexplorer2.backend.service.CurrentUserService;
import com.wodexplorer2.backend.service.ExerciseResultService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExerciseResultServiceTest {

    @Mock
    private ExerciseResultRepository exerciseResultRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private ExerciseResultMapper exerciseResultMapper;

    @Mock
    private CurrentUserService currentUserService;

    private ExerciseResultService exerciseResultService;

    @BeforeEach
    void setUp() {
        exerciseResultService = new ExerciseResultService(
                exerciseResultRepository,
                exerciseRepository,
                exerciseResultMapper,
                currentUserService);
    }

    @Test
    void groupsWeightResultsByExerciseAndRepsAndSelectsHighestLoad() {
        User user = user(7L);
        ExerciseResult lighterThreeReps = weightResult(
                1L, 10L, 3, "80", "2026-01-01T10:00:00");
        ExerciseResult heavierThreeReps = weightResult(
                2L, 10L, 3, "90", "2026-01-02T10:00:00");
        ExerciseResult differentRepGroup = weightResult(
                3L, 10L, 5, "70", "2026-01-03T10:00:00");

        when(currentUserService.require()).thenReturn(user);
        when(exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(7L))
                .thenReturn(List.of(lighterThreeReps, heavierThreeReps, differentRepGroup));

        List<ExerciseResult> bests = exerciseResultService.findPersonalBests();

        assertEquals(List.of(differentRepGroup, heavierThreeReps), bests);
    }

    @Test
    void selectsHighestRepsForEachExercise() {
        User user = user(7L);
        ExerciseResult fewerReps = repsResult(1L, 10L, 8, "2026-01-01T10:00:00");
        ExerciseResult moreReps = repsResult(2L, 10L, 12, "2026-01-02T10:00:00");
        ExerciseResult otherExercise = repsResult(3L, 20L, 10, "2026-01-03T10:00:00");

        when(currentUserService.require()).thenReturn(user);
        when(exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(7L))
                .thenReturn(List.of(fewerReps, moreReps, otherExercise));

        List<ExerciseResult> bests = exerciseResultService.findPersonalBests();

        assertEquals(List.of(otherExercise, moreReps), bests);
    }

    @Test
    void groupsDistanceTimeResultsByExerciseAndDistanceAndSelectsFastestDuration() {
        User user = user(7L);
        ExerciseResult slowerFiveK = distanceTimeResult(
                1L, 10L, "5000.00", 2000, "2026-01-01T10:00:00");
        ExerciseResult fasterFiveK = distanceTimeResult(
                2L, 10L, "5000", 1472, "2026-01-02T10:00:00");
        ExerciseResult oneK = distanceTimeResult(
                3L, 10L, "1000", 500, "2026-01-03T10:00:00");
        ExerciseResult otherExercise = distanceTimeResult(
                4L, 20L, "5000", 300, "2026-01-04T10:00:00");

        when(currentUserService.require()).thenReturn(user);
        when(exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(7L))
                .thenReturn(List.of(slowerFiveK, fasterFiveK, oneK, otherExercise));

        List<ExerciseResult> bests = exerciseResultService.findPersonalBests();

        assertEquals(List.of(otherExercise, oneK, fasterFiveK), bests);
    }

    @Test
    void resolvesDistanceTimeTiesByPerformedAtThenId() {
        User user = user(7L);
        ExerciseResult olderHigherId = distanceTimeResult(
                9L, 10L, "5000", 1472, "2026-01-01T10:00:00");
        ExerciseResult newerLowerId = distanceTimeResult(
                2L, 10L, "5000", 1472, "2026-01-02T10:00:00");
        ExerciseResult sameDateHigherId = distanceTimeResult(
                10L, 10L, "5000.00", 1472, "2026-01-02T10:00:00");

        when(currentUserService.require()).thenReturn(user);
        when(exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(7L))
                .thenReturn(List.of(olderHigherId, newerLowerId, sameDateHigherId));

        List<ExerciseResult> bests = exerciseResultService.findPersonalBests();

        assertEquals(List.of(sameDateHigherId), bests);
    }

    @Test
    void resolvesValueTiesByPerformedAtThenId() {
        User user = user(7L);
        ExerciseResult olderHigherId = weightResult(
                9L, 10L, 3, "90", "2026-01-01T10:00:00");
        ExerciseResult newerLowerId = weightResult(
                2L, 10L, 3, "90", "2026-01-02T10:00:00");
        ExerciseResult sameDateHigherId = weightResult(
                10L, 10L, 3, "90", "2026-01-02T10:00:00");

        when(currentUserService.require()).thenReturn(user);
        when(exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(7L))
                .thenReturn(List.of(olderHigherId, newerLowerId, sameDateHigherId));

        List<ExerciseResult> bests = exerciseResultService.findPersonalBests();

        assertEquals(List.of(sameDateHigherId), bests);
    }

    @Test
    void excludesUnsupportedMeasurementTypes() {
        User user = user(7L);
        ExerciseResult time = result(
                1L,
                10L,
                MeasurementType.TIME,
                5,
                null,
                null,
                60,
                "2026-01-01T10:00:00");
        ExerciseResult distance = result(
                2L,
                20L,
                MeasurementType.DISTANCE,
                null,
                null,
                "400",
                null,
                "2026-01-02T10:00:00");
        ExerciseResult weightDistance = result(
                3L,
                30L,
                MeasurementType.WEIGHT_DISTANCE,
                null,
                "20",
                "400",
                null,
                "2026-01-03T10:00:00");
        ExerciseResult invalidDistanceTime = result(
                4L,
                40L,
                MeasurementType.DISTANCE_TIME,
                null,
                null,
                "400",
                0,
                "2026-01-04T10:00:00");

        when(currentUserService.require()).thenReturn(user);
        when(exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(7L))
                .thenReturn(List.of(time, distance, weightDistance, invalidDistanceTime));

        assertEquals(List.of(), exerciseResultService.findPersonalBests());
    }

    @Test
    void requestsOnlyCurrentUsersResults() {
        User user = user(42L);
        ExerciseResult currentUserResult = distanceTimeResult(
                1L, 10L, "5000", 1472, "2026-01-01T10:00:00");
        when(currentUserService.require()).thenReturn(user);
        when(exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(42L))
                .thenReturn(List.of(currentUserResult));

        assertEquals(List.of(currentUserResult), exerciseResultService.findPersonalBests());

        verify(exerciseResultRepository).findByUserIdOrderByPerformedAtDesc(42L);
    }

    private ExerciseResult weightResult(
            Long id,
            Long exerciseId,
            int reps,
            String weightKg,
            String performedAt) {
        return result(
                id,
                exerciseId,
                MeasurementType.WEIGHT,
                reps,
                weightKg,
                null,
                null,
                performedAt);
    }

    private ExerciseResult repsResult(
            Long id,
            Long exerciseId,
            int reps,
            String performedAt) {
        return result(
                id,
                exerciseId,
                MeasurementType.REPS,
                reps,
                null,
                null,
                null,
                performedAt);
    }

    private ExerciseResult distanceTimeResult(
            Long id,
            Long exerciseId,
            String distanceM,
            Integer durationSeconds,
            String performedAt) {
        return result(
                id,
                exerciseId,
                MeasurementType.DISTANCE_TIME,
                null,
                null,
                distanceM,
                durationSeconds,
                performedAt);
    }

    private ExerciseResult result(
            Long id,
            Long exerciseId,
            MeasurementType measurementType,
            Integer reps,
            String weightKg,
            String distanceM,
            Integer durationSeconds,
            String performedAt) {
        Exercise exercise = org.mockito.Mockito.mock(Exercise.class);
        ExerciseResult result = org.mockito.Mockito.mock(ExerciseResult.class);
        when(exercise.getMeasurementType()).thenReturn(measurementType);
        when(result.getExercise()).thenReturn(exercise);

        if (measurementType == MeasurementType.WEIGHT
                || measurementType == MeasurementType.REPS
                || measurementType == MeasurementType.DISTANCE_TIME) {
            lenient().when(result.getId()).thenReturn(id);
            lenient().when(exercise.getId()).thenReturn(exerciseId);
            lenient().when(result.getReps()).thenReturn(reps);
            lenient().when(result.getWeightKg()).thenReturn(
                    weightKg == null ? null : new BigDecimal(weightKg));
            lenient().when(result.getDistanceM()).thenReturn(
                    distanceM == null ? null : new BigDecimal(distanceM));
            lenient().when(result.getDurationSeconds()).thenReturn(durationSeconds);
            lenient().when(result.getPerformedAt()).thenReturn(LocalDateTime.parse(performedAt));
        }

        return result;
    }

    private User user(Long id) {
        User user = org.mockito.Mockito.mock(User.class);
        when(user.getId()).thenReturn(id);
        return user;
    }
}
