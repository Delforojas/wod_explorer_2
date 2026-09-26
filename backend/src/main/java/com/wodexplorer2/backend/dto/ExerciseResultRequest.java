package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ExerciseResultRequest(
    @NotNull Long exerciseId,
    @Min(0) Integer reps,
    @Min(0) BigDecimal weightKg,
    @Min(0) BigDecimal distanceM,
    @Min(0) Integer durationSeconds,
    @NotNull LocalDateTime performedAt) {
}
