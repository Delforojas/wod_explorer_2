package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.ExerciseResultRequest;
import com.wodexplorer2.backend.dto.ExerciseResultResponse;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.ExerciseResult;
import com.wodexplorer2.backend.entity.User;

import org.springframework.stereotype.Component;

@Component
public class ExerciseResultMapper {

  // REQUEST DTO → ENTITY
  public ExerciseResult toEntity(
      ExerciseResultRequest request,
      User user,
      Exercise exercise) {

    return new ExerciseResult(
        user,
        exercise,
        request.reps(),
        request.weightKg(),
        request.distanceM(),
        request.durationSeconds(),
        request.performedAt());
  }

  // ENTITY → RESPONSE DTO
  public ExerciseResultResponse toResponse(ExerciseResult exerciseResult) {
    return new ExerciseResultResponse(
        exerciseResult.getId(),
        exerciseResult.getExercise().getId(),
        exerciseResult.getReps(),
        exerciseResult.getWeightKg(),
        exerciseResult.getDistanceM(),
        exerciseResult.getDurationSeconds(),
        exerciseResult.getPerformedAt(),
        exerciseResult.getCreatedAt());
  }
}