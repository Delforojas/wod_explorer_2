package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodType;

import java.time.LocalDateTime;

public record WodVersionResponse(
        Long id,
        Long wodId,
        String wodName,
        Integer versionNumber,
        WodType type,
        Integer timeCapSeconds,
        Integer rounds,
        LocalDateTime createdAt) {
}