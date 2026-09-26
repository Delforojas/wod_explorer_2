package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record WodResultRequest(
    @NotNull Long wodVersionId,
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
