package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ExerciseResultRequest(
    Long exerciseId,
    Integer reps,
    BigDecimal weightKg,
    BigDecimal distanceM,
    Integer durationSeconds,
    LocalDateTime performedAt) {
}