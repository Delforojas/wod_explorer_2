package com.wodexplorer2.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.dao.DataIntegrityViolationException;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidation(
      MethodArgumentNotValidException exception,
      HttpServletRequest request) {
    String message = exception.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining(", "));
    return response(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message, request);
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
      MethodArgumentTypeMismatchException exception,
      HttpServletRequest request) {
    return response(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Parámetro inválido", request);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiErrorResponse> handleUnreadableBody(
      HttpMessageNotReadableException exception,
      HttpServletRequest request) {
    return response(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Cuerpo de request inválido", request);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
      DataIntegrityViolationException exception,
      HttpServletRequest request) {
    return response(HttpStatus.CONFLICT, "CONFLICT", "La operación viola una restricción de datos", request);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ApiErrorResponse> handleConflict(
      ConflictException exception,
      HttpServletRequest request) {
    return response(HttpStatus.CONFLICT, "CONFLICT", exception.getMessage(), request);
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<ApiErrorResponse> handleForbidden(
      ForbiddenException exception,
      HttpServletRequest request) {
    return response(HttpStatus.FORBIDDEN, "FORBIDDEN", exception.getMessage(), request);
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(
      InvalidCredentialsException exception,
      HttpServletRequest request) {
    return response(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", exception.getMessage(), request);
  }

  @ExceptionHandler(InvalidWodDefinitionException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidWodDefinition(
      InvalidWodDefinitionException exception,
      HttpServletRequest request) {
    return response(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", exception.getMessage(), request);
  }

  @ExceptionHandler(InvalidWodResultException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidWodResult(
      InvalidWodResultException exception,
      HttpServletRequest request) {
    return response(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", exception.getMessage(), request);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleNotFound(
      ResourceNotFoundException exception,
      HttpServletRequest request) {
    return response(HttpStatus.NOT_FOUND, "NOT_FOUND", exception.getMessage(), request);
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ApiErrorResponse> handleUnauthorized(
      UnauthorizedException exception,
      HttpServletRequest request) {
    return response(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", exception.getMessage(), request);
  }

  private ResponseEntity<ApiErrorResponse> response(
      HttpStatus status,
      String error,
      String message,
      HttpServletRequest request) {
    return ResponseEntity.status(status)
        .body(new ApiErrorResponse(status.value(), error, message, request.getRequestURI()));
  }
}
