package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.LoginRequest;
import com.wodexplorer2.backend.dto.RegisterRequest;
import com.wodexplorer2.backend.exception.ConflictException;
import com.wodexplorer2.backend.exception.InvalidCredentialsException;
import com.wodexplorer2.backend.repository.UserRepository;
import com.wodexplorer2.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.wodexplorer2.backend.entity.User;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public String register(RegisterRequest request) {

    if (userRepository.existsByUsername(request.username())) {
      throw new ConflictException("El nombre de usuario ya existe");
    }

    if (userRepository.existsByEmail(request.email())) {
      throw new ConflictException("El correo electrónico ya existe");
    }

    String passwordHash = passwordEncoder.encode(request.password());

    User user = new User(
        request.username(),
        request.email(),
        passwordHash);

    userRepository.save(user);

    return jwtService.generateToken(user.getUsername());
  }

  public String login(LoginRequest request) {

    User user = userRepository.findByUsername(request.username())
        .orElseThrow(InvalidCredentialsException::new);

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new InvalidCredentialsException();
    }

    return jwtService.generateToken(user.getUsername());
  }
}
