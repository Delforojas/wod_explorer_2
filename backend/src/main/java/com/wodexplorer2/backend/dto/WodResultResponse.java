package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WodResultResponse(
        Long id,
        Long wodId,
        String wodName,
        WodOrigin origin,
        Long wodVersionId,
        WodType type,
        LocalDateTime performedAt,
        Boolean completed,
        Integer timeSeconds,
        Integer progressRounds,
        Long progressItemId,
        Integer progressReps,
        BigDecimal progressDistanceM,
        Integer progressDurationSeconds,
        Integer amrapRounds,
        Integer amrapExtraReps,
        LocalDateTime createdAt) {
}
