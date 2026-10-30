package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.entity.AuthProvider;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.UserIdentity;
import com.wodexplorer2.backend.exception.ConflictException;
import com.wodexplorer2.backend.repository.UserIdentityRepository;
import com.wodexplorer2.backend.repository.UserRepository;
import com.wodexplorer2.backend.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Objects;

@Service
public class GoogleOAuthService {

  private final UserRepository userRepository;
  private final UserIdentityRepository userIdentityRepository;
  private final JwtService jwtService;
  private final OAuthLoginHandoffService handoffService;

  public GoogleOAuthService(
      UserRepository userRepository,
      UserIdentityRepository userIdentityRepository,
      JwtService jwtService,
      OAuthLoginHandoffService handoffService) {

    this.userRepository = userRepository;
    this.userIdentityRepository = userIdentityRepository;
    this.jwtService = jwtService;
    this.handoffService = handoffService;
  }

  @Transactional
  public String createLoginHandoff(
      String providerUserId,
      String email,
      Boolean emailVerified,
      String browserBinding) {
    if (providerUserId == null || providerUserId.isBlank()
        || email == null || email.isBlank()
        || !Objects.equals(Boolean.TRUE, emailVerified)) {
      throw new ConflictException("La cuenta de Google no tiene una identidad verificada.");
    }

    String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

    UserIdentity identity = userIdentityRepository
        .findByProviderAndProviderUserId(
            AuthProvider.GOOGLE,
            providerUserId)
        .orElse(null);

    User user;
    if (identity != null) {
      user = identity.getUser();
    } else {
      if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
        throw new ConflictException("Ya existe una cuenta con este correo electrónico");
      }

      user = userRepository.save(new User(
          generateUsername(normalizedEmail),
          normalizedEmail,
          null));

      userIdentityRepository.save(new UserIdentity(
          user,
          AuthProvider.GOOGLE,
          providerUserId));
    }

    return handoffService.create(user, AuthProvider.GOOGLE, browserBinding);
  }

  @Transactional
  public String exchange(String code, String browserBinding) {
    User user = handoffService.consume(code, AuthProvider.GOOGLE, browserBinding);
    return jwtService.generateToken(user.getUsername());
  }

  private String generateUsername(String email) {
    String localPart = email.substring(0, email.indexOf("@"));
    String baseUsername = localPart.toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9_]+", "_")
        .replaceAll("^_+|_+$", "");

    if (baseUsername.isBlank()) {
      baseUsername = "google_user";
    }

    baseUsername = baseUsername.substring(0, Math.min(baseUsername.length(), 50));
    String username = baseUsername;
    int suffix = 1;

    while (userRepository.existsByUsername(username)) {
      String suffixText = "_" + suffix;
      int baseLength = Math.min(baseUsername.length(), 50 - suffixText.length());
      username = baseUsername.substring(0, baseLength) + suffixText;
      suffix++;
    }

    return username;
  }
}
