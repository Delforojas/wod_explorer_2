package com.wodexplorer2.backend.exception;

public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException() {
    super("Usuario o contraseña incorrectos");
  }
}
