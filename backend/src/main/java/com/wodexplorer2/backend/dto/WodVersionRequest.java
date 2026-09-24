package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodType;

public record WodVersionRequest(
    Long wodId,
    WodType type,
    Integer timeCapSeconds,
    Integer rounds) {
}