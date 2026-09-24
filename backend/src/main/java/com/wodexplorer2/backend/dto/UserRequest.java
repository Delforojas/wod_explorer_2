package com.wodexplorer2.backend.dto;

public record UserRequest(
    String username,
    String email,
    String password) {
}