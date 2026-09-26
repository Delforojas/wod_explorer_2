package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record WodVersionItemRequest(
    @NotNull Long wodVersionId,
    @NotNull Long exerciseId,
    @NotNull @Min(0) Integer position,
    @Min(0) Integer reps,
    @Min(0) BigDecimal weightKg,
    @Min(0) BigDecimal distanceM,
    @Min(0) Integer durationSeconds) {
}
