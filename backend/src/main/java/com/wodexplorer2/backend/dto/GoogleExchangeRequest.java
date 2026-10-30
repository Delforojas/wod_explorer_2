package com.wodexplorer2.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GoogleExchangeRequest(
    @NotBlank @Size(max = 128) String code) {
}
