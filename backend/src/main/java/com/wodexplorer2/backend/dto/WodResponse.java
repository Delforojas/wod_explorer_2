package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodOrigin;

import java.time.LocalDateTime;

public record WodResponse(
    Long id,
    Long ownerId,
    String name,
    WodOrigin origin,
    LocalDateTime createdAt) {
}