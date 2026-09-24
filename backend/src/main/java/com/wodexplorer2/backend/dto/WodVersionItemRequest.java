package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;

public record WodVersionItemRequest(
    Long exerciseId,
    Integer position,
    Integer reps,
    BigDecimal weightKg,
    BigDecimal distanceM,
    Integer durationSeconds) {
}