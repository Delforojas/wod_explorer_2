package com.wodexplorer2.backend.dto;

import jakarta.validation.constraints.Min;

public record WodProgressionRuleRequest(
    @Min(1) Integer startReps,
    @Min(1) Integer incrementReps,
    @Min(1) Integer everyRounds) {
}
