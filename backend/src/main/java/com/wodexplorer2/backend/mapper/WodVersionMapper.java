package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.WodVersionRequest;
import com.wodexplorer2.backend.dto.WodVersionResponse;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodVersion;

import org.springframework.stereotype.Component;

@Component
public class WodVersionMapper {

  // REQUEST DTO → ENTITY
  public WodVersion toEntity(
      WodVersionRequest request,
      Wod wod,
      Integer versionNumber) {

    return new WodVersion(
        wod,
        versionNumber,
        request.type(),
        request.timeCapSeconds(),
        request.rounds());
  }

  // ENTITY → RESPONSE DTO
  public WodVersionResponse toResponse(WodVersion wodVersion) {
    return new WodVersionResponse(
        wodVersion.getId(),
        wodVersion.getWod().getId(),
        wodVersion.getVersionNumber(),
        wodVersion.getType(),
        wodVersion.getTimeCapSeconds(),
        wodVersion.getRounds(),
        wodVersion.getCreatedAt());
  }
}