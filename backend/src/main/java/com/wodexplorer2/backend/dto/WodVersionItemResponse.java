package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record WodVersionItemResponse(
        Long id,
        Long wodVersionId,
        Long exerciseId,
        String exerciseName,
        Integer position,
        Integer reps,
        BigDecimal weightKg,
        BigDecimal distanceM,
        Integer durationSeconds,
        Integer calories,
        List<WodItemPrescriptionResponse> prescriptions) {
}
