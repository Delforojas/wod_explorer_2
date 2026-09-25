package com.wodexplorer2.backend.dto;

public record LoginRequest(
    String username,
    String password) {
}