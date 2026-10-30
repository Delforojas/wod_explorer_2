package com.wodexplorer2.backend;

import com.wodexplorer2.backend.entity.AuthProvider;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.UserIdentity;
import com.wodexplorer2.backend.exception.ConflictException;
import com.wodexplorer2.backend.repository.UserIdentityRepository;
import com.wodexplorer2.backend.repository.UserRepository;
import com.wodexplorer2.backend.security.JwtService;
import com.wodexplorer2.backend.service.GoogleOAuthService;
import com.wodexplorer2.backend.service.OAuthLoginHandoffService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GoogleOAuthServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private UserIdentityRepository userIdentityRepository;

  @Mock
  private JwtService jwtService;

  @Mock
  private OAuthLoginHandoffService handoffService;

  @Test
  void rejectsUnverifiedGoogleEmail() {
    GoogleOAuthService service = service();

    assertThatThrownBy(() -> service.createLoginHandoff(
        "google-sub",
        "user@example.com",
        false,
        "browser-session"))
        .isInstanceOf(ConflictException.class)
        .hasMessage("La cuenta de Google no tiene una identidad verificada.");

    verify(userIdentityRepository, never()).findByProviderAndProviderUserId(
        any(AuthProvider.class), anyString());
  }

  @Test
  void doesNotAutoLinkExistingLocalEmail() {
    GoogleOAuthService service = service();
    when(userIdentityRepository.findByProviderAndProviderUserId(
        AuthProvider.GOOGLE,
        "google-sub")).thenReturn(Optional.empty());
    when(userRepository.findByEmailIgnoreCase("user@example.com"))
        .thenReturn(Optional.of(new User("local-user", "user@example.com", "hash")));

    assertThatThrownBy(() -> service.createLoginHandoff(
        "google-sub",
        "USER@example.com",
        true,
        "browser-session"))
        .isInstanceOf(ConflictException.class)
        .hasMessage("Ya existe una cuenta con este correo electrónico");

    verify(userRepository, never()).save(any(User.class));
    verify(handoffService, never()).create(
        any(User.class), any(AuthProvider.class), anyString());
  }

  @Test
  void resolvesExistingGoogleIdentityBeforeCheckingEmail() {
    GoogleOAuthService service = service();
    User user = new User("google-user", "old@example.com", null);
    when(userIdentityRepository.findByProviderAndProviderUserId(
        AuthProvider.GOOGLE,
        "google-sub")).thenReturn(Optional.of(new UserIdentity(
            user,
            AuthProvider.GOOGLE,
            "google-sub")));
    when(handoffService.create(user, AuthProvider.GOOGLE, "browser-session"))
        .thenReturn("handoff");

    service.createLoginHandoff("google-sub", "new@example.com", true, "browser-session");

    verify(handoffService).create(user, AuthProvider.GOOGLE, "browser-session");
    verify(userRepository, never()).findByEmailIgnoreCase(anyString());
  }

  @Test
  void exchangesAValidHandoffForTheExistingJwtContract() {
    GoogleOAuthService service = service();
    User user = new User("google-user", "google@example.com", null);
    when(handoffService.consume("handoff", AuthProvider.GOOGLE, "browser-session"))
        .thenReturn(user);
    when(jwtService.generateToken("google-user")).thenReturn("jwt");

    String token = service.exchange("handoff", "browser-session");

    org.assertj.core.api.Assertions.assertThat(token).isEqualTo("jwt");
    verify(handoffService).consume("handoff", AuthProvider.GOOGLE, "browser-session");
  }

  private GoogleOAuthService service() {
    return new GoogleOAuthService(
        userRepository,
        userIdentityRepository,
        jwtService,
        handoffService);
  }
}
