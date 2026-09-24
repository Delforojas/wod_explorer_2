package com.wodexplorer2.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WodResultRequest(
    Long wodVersionId,
    LocalDateTime performedAt,
    Boolean completed,
    Integer timeSeconds,
    Integer progressRounds,
    Long progressItemId,
    Integer progressReps,
    BigDecimal progressDistanceM,
    Integer progressDurationSeconds,
    Integer amrapRounds,
    Integer amrapExtraReps) {
}