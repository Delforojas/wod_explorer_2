package com.wodexplorer2.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record WodCompositionItemRequest(
    @NotNull Long exerciseId,
    @Min(0) Integer reps,
    @DecimalMin(value = "0.0", inclusive = true) BigDecimal weightKg,
    @DecimalMin(value = "0.0", inclusive = true) BigDecimal distanceM,
    @Min(0) Integer durationSeconds) {
}
