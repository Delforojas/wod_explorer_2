package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.ExerciseRequest;
import com.wodexplorer2.backend.dto.ExerciseResponse;
import com.wodexplorer2.backend.entity.Exercise;

import org.springframework.stereotype.Component;

@Component
public class ExerciseMapper {

    // REQUEST DTO → ENTITY
    public Exercise toEntity(ExerciseRequest request) {
        return new Exercise(
                request.name(),
                request.category(),
                request.measurementType());
    }

    // ENTITY → RESPONSE DTO
    public ExerciseResponse toResponse(Exercise exercise) {
        return new ExerciseResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getCategory(),
                exercise.getMeasurementType(),
                exercise.isActive());
    }
}