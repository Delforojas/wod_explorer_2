package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodOrigin;
import java.time.LocalDateTime;
import java.util.List;

public record WodAggregateResponse(
    Long id,
    Long ownerId,
    String name,
    WodOrigin origin,
    LocalDateTime createdAt,
    WodVersionResponse version,
    List<WodVersionItemResponse> composition) {
}
