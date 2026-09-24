package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.ExerciseCategory;
import com.wodexplorer2.backend.entity.MeasurementType;

public record ExerciseResponse(
        Long id,
        String name,
        ExerciseCategory category,
        MeasurementType measurementType,
        boolean active) {
}