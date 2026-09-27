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

@Service
public class GoogleOAuthService {

  private final UserRepository userRepository;
  private final UserIdentityRepository userIdentityRepository;
  private final JwtService jwtService;

  public GoogleOAuthService(
      UserRepository userRepository,
      UserIdentityRepository userIdentityRepository,
      JwtService jwtService) {

    this.userRepository = userRepository;
    this.userIdentityRepository = userIdentityRepository;
    this.jwtService = jwtService;
  }

  @Transactional
  public String loginWithGoogle(String providerUserId, String email) {

    UserIdentity identity = userIdentityRepository
        .findByProviderAndProviderUserId(
            AuthProvider.GOOGLE,
            providerUserId)
        .orElse(null);

    if (identity != null) {
      return jwtService.generateToken(
          identity.getUser().getUsername());
    }

    if (userRepository.existsByEmail(email)) {
      throw new ConflictException(
          "Ya existe una cuenta con este correo electrónico");
    }

    String username = generateUsername(email);

    User user = new User(
        username,
        email,
        null);

    userRepository.save(user);

    UserIdentity googleIdentity = new UserIdentity(
        user,
        AuthProvider.GOOGLE,
        providerUserId);

    userIdentityRepository.save(googleIdentity);

    return jwtService.generateToken(user.getUsername());
  }

  private String generateUsername(String email) {

    String baseUsername = email.substring(0, email.indexOf("@"));
    String username = baseUsername;
    int suffix = 1;

    while (userRepository.existsByUsername(username)) {
      username = baseUsername + "_" + suffix;
      suffix++;
    }

    return username;
  }
}