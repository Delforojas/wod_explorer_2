package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodCategory;

import java.time.LocalDateTime;

public record WodResponse(
    Long id,
    Long ownerId,
    String name,
    WodOrigin origin,
    WodCategory category,
    LocalDateTime createdAt) {
}
