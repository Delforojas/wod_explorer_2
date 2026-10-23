package com.wodexplorer2.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WodResultUpdateRequest(
        @NotNull LocalDateTime performedAt,
        Boolean completed,
        @Min(0) Integer timeSeconds,
        @Min(0) Integer progressRounds,
        Long progressItemId,
        @Min(0) Integer progressReps,
        @Min(0) BigDecimal progressDistanceM,
        @Min(0) Integer progressDurationSeconds,
        @Min(0) Integer amrapRounds,
        @Min(0) Integer amrapExtraReps) {
}
