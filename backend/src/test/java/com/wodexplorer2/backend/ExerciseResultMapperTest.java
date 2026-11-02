package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.wodexplorer2.backend.dto.ExerciseResultResponse;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.ExerciseResult;
import com.wodexplorer2.backend.entity.MeasurementType;
import com.wodexplorer2.backend.mapper.ExerciseResultMapper;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class ExerciseResultMapperTest {

    private final ExerciseResultMapper mapper = new ExerciseResultMapper();

    @Test
    void includesHistoricalExerciseMetadataWhenExerciseIsInactive() {
        Exercise exercise = mock(Exercise.class);
        ExerciseResult result = mock(ExerciseResult.class);
        LocalDateTime performedAt = LocalDateTime.parse("2026-01-10T09:30:00");

        when(exercise.getId()).thenReturn(12L);
        when(exercise.getName()).thenReturn("Archived Back Squat");
        when(exercise.getMeasurementType()).thenReturn(MeasurementType.WEIGHT);
        when(exercise.isActive()).thenReturn(false);
        when(result.getId()).thenReturn(44L);
        when(result.getExercise()).thenReturn(exercise);
        when(result.getReps()).thenReturn(5);
        when(result.getWeightKg()).thenReturn(new BigDecimal("100"));
        when(result.getPerformedAt()).thenReturn(performedAt);

        ExerciseResultResponse response = mapper.toResponse(result);

        assertEquals(44L, response.id());
        assertEquals(12L, response.exerciseId());
        assertEquals("Archived Back Squat", response.exerciseName());
        assertEquals(MeasurementType.WEIGHT, response.measurementType());
        assertEquals(performedAt, response.performedAt());
    }
}
