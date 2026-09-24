package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ExerciseResultResponse(
    Long id,
    Long exerciseId,
    Integer reps,
    BigDecimal weightKg,
    BigDecimal distanceM,
    Integer durationSeconds,
    LocalDateTime performedAt,
    LocalDateTime createdAt) {
}