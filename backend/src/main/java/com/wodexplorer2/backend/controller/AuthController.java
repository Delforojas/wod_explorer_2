package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.LoginRequest;
import com.wodexplorer2.backend.dto.RegisterRequest;
import com.wodexplorer2.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
    String token = authService.register(request);

    return ResponseEntity.ok(token);
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody LoginRequest request) {
    String token = authService.login(request);

    return ResponseEntity.ok(token);
  }
}