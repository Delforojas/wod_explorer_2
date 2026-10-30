package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.entity.AuthProvider;
import com.wodexplorer2.backend.entity.OAuthLoginHandoff;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.exception.UnauthorizedException;
import com.wodexplorer2.backend.repository.OAuthLoginHandoffRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class OAuthLoginHandoffService {

  private static final String DEFAULT_REDIRECT_PATH = "/";

  private final OAuthLoginHandoffRepository handoffRepository;
  private final SecureRandom secureRandom;
  private final long handoffTtlSeconds;

  public OAuthLoginHandoffService(
      OAuthLoginHandoffRepository handoffRepository,
      @Value("${app.oauth.handoff-ttl-seconds:300}") long handoffTtlSeconds) {
    this.handoffRepository = handoffRepository;
    this.secureRandom = new SecureRandom();
    this.handoffTtlSeconds = handoffTtlSeconds;
  }

  @Transactional
  public String create(User user, AuthProvider provider, String browserBinding) {
    if (browserBinding == null || browserBinding.isBlank()) {
      throw new IllegalStateException("No se pudo vincular la sesión OAuth al navegador.");
    }

    byte[] randomCode = new byte[32];
    secureRandom.nextBytes(randomCode);
    String rawCode = Base64.getUrlEncoder().withoutPadding().encodeToString(randomCode);
    String tokenHash = hash(rawCode);
    String browserBindingHash = hash(browserBinding);

    OAuthLoginHandoff handoff = new OAuthLoginHandoff(
        tokenHash,
        browserBindingHash,
        user,
        provider,
        DEFAULT_REDIRECT_PATH,
        LocalDateTime.now(ZoneOffset.UTC).plusSeconds(handoffTtlSeconds));

    handoffRepository.save(handoff);
    return rawCode;
  }

  @Transactional
  public User consume(
      String rawCode,
      AuthProvider expectedProvider,
      String browserBinding) {
    if (rawCode == null || rawCode.isBlank()
        || browserBinding == null || browserBinding.isBlank()) {
      throw invalidHandoff();
    }

    String tokenHash = hash(rawCode);
    String browserBindingHash = hash(browserBinding);
    if (handoffRepository.consumeIfValid(tokenHash, browserBindingHash) != 1) {
      throw invalidHandoff();
    }

    OAuthLoginHandoff handoff = handoffRepository.findByTokenHash(tokenHash)
        .orElseThrow(this::invalidHandoff);

    if (handoff.getProvider() != expectedProvider) {
      throw invalidHandoff();
    }

    return handoff.getUser();
  }

  private UnauthorizedException invalidHandoff() {
    return new UnauthorizedException("El enlace de acceso de Google no es válido o ha expirado.");
  }

  private String hash(String value) {
    try {
      byte[] digest = MessageDigest.getInstance("SHA-256")
          .digest(value.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(digest);
    } catch (NoSuchAlgorithmException exception) {
      throw new IllegalStateException("No se pudo preparar el enlace de acceso.", exception);
    }
  }
}
