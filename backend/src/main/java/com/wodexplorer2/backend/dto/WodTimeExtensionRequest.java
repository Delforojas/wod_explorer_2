package com.wodexplorer2.backend.dto;

import jakarta.validation.constraints.Min;

public record WodTimeExtensionRequest(
    @Min(1) Integer initialSeconds,
    @Min(1) Integer extensionSeconds,
    @Min(1) Integer roundsPerExtension) {
}
