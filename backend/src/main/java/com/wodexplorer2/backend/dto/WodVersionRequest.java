package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record WodVersionRequest(
    @NotNull Long wodId,
    @NotNull WodType type,
    @Min(1) Integer timeCapSeconds,
    @Min(1) Integer rounds) {
}
