package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;

public record WodVersionItemResponse(
    Long id,
    Long wodVersionId,
    Long exerciseId,
    Integer position,
    Integer reps,
    BigDecimal weightKg,
    BigDecimal distanceM,
    Integer durationSeconds) {
}