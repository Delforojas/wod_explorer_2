package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.wodexplorer2.backend.entity.MeasurementType;

public record ExerciseResultResponse(
    Long id,
    Long exerciseId,
    String exerciseName,
    MeasurementType measurementType,
    Integer reps,
    BigDecimal weightKg,
    BigDecimal distanceM,
    Integer durationSeconds,
    LocalDateTime performedAt,
    LocalDateTime createdAt) {
}
