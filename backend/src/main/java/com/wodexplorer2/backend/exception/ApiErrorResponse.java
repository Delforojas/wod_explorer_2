package com.wodexplorer2.backend.exception;

public record ApiErrorResponse(
    int status,
    String error,
    String message,
    String path) {
}
