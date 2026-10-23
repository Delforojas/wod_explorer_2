package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.WodVersionItemRequest;
import com.wodexplorer2.backend.dto.WodVersionItemResponse;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;

import org.springframework.stereotype.Component;

@Component
public class WodVersionItemMapper {

  // REQUEST DTO → ENTITY
  public WodVersionItem toEntity(
      WodVersionItemRequest request,
      WodVersion wodVersion,
      Exercise exercise) {

    return new WodVersionItem(
        wodVersion,
        exercise,
        request.position(),
        request.reps(),
        request.weightKg(),
        request.distanceM(),
        request.durationSeconds());
  }

  // ENTITY → RESPONSE DTO
  public WodVersionItemResponse toResponse(WodVersionItem item) {
    return new WodVersionItemResponse(
        item.getId(),
        item.getWodVersion().getId(),
        item.getExercise().getId(),
        item.getExercise().getName(),
        item.getPosition(),
        item.getReps(),
        item.getWeightKg(),
        item.getDistanceM(),
        item.getDurationSeconds());
  }
}