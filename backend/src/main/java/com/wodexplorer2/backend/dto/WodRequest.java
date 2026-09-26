package com.wodexplorer2.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WodRequest(
    @NotBlank @Size(max = 100) String name) {
}
