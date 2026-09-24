package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.WodResultRequest;
import com.wodexplorer2.backend.dto.WodResultResponse;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;

import org.springframework.stereotype.Component;

@Component
public class WodResultMapper {

  // REQUEST DTO → ENTITY
  public WodResult toEntity(
      WodResultRequest request,
      User user,
      WodVersion wodVersion,
      WodVersionItem progressItem) {

    return new WodResult(
        user,
        wodVersion,
        request.performedAt(),
        request.completed(),
        request.timeSeconds(),
        request.progressRounds(),
        progressItem,
        request.progressReps(),
        request.progressDistanceM(),
        request.progressDurationSeconds(),
        request.amrapRounds(),
        request.amrapExtraReps());
  }

  // ENTITY → RESPONSE DTO
  public WodResultResponse toResponse(WodResult wodResult) {
    return new WodResultResponse(
        wodResult.getId(),
        wodResult.getWodVersion().getId(),
        wodResult.getPerformedAt(),
        wodResult.getCompleted(),
        wodResult.getTimeSeconds(),
        wodResult.getProgressRounds(),
        wodResult.getProgressItem() != null
            ? wodResult.getProgressItem().getId()
            : null,
        wodResult.getProgressReps(),
        wodResult.getProgressDistanceM(),
        wodResult.getProgressDurationSeconds(),
        wodResult.getAmrapRounds(),
        wodResult.getAmrapExtraReps(),
        wodResult.getCreatedAt());
  }
}