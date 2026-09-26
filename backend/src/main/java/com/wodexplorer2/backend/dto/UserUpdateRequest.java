package com.wodexplorer2.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
    @NotBlank @Size(max = 50) String username,
    @NotBlank @Email @Size(max = 254) String email) {
}
