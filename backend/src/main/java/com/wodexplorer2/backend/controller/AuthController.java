package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.LoginRequest;
import com.wodexplorer2.backend.dto.RegisterRequest;
import com.wodexplorer2.backend.dto.GoogleExchangeRequest;
import com.wodexplorer2.backend.service.AuthService;
import com.wodexplorer2.backend.service.GoogleOAuthService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final GoogleOAuthService googleOAuthService;

  public AuthController(AuthService authService, GoogleOAuthService googleOAuthService) {
    this.authService = authService;
    this.googleOAuthService = googleOAuthService;
  }

  @PostMapping("/register")
  public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
    String token = authService.register(request);

    return ResponseEntity.ok(token);
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
    String token = authService.login(request);

    return ResponseEntity.ok(token);
  }

  @PostMapping("/google/exchange")
  public ResponseEntity<String> exchangeGoogle(
      @Valid @RequestBody GoogleExchangeRequest request,
      HttpServletRequest httpRequest) {
    HttpSession session = httpRequest.getSession(false);
    String browserBinding = session == null ? null : session.getId();

    return ResponseEntity.ok(googleOAuthService.exchange(request.code(), browserBinding));
  }
}
