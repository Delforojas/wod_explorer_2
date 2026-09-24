package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.WodRequest;
import com.wodexplorer2.backend.dto.WodResponse;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;

import org.springframework.stereotype.Component;

@Component
public class WodMapper {

  // REQUEST DTO → ENTITY
  public Wod toEntity(
      WodRequest request,
      User owner,
      WodOrigin origin) {

    return new Wod(
        owner,
        request.name(),
        origin);
  }

  // ENTITY → RESPONSE DTO
  public WodResponse toResponse(Wod wod) {
    return new WodResponse(
        wod.getId(),
        wod.getOwner() != null
            ? wod.getOwner().getId()
            : null,
        wod.getName(),
        wod.getOrigin(),
        wod.getCreatedAt());
  }
}