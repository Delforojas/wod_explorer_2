package com.wodexplorer2.backend.dto;

public record WodTimeExtensionResponse(
    Integer initialSeconds,
    Integer extensionSeconds,
    Integer roundsPerExtension) {
}
