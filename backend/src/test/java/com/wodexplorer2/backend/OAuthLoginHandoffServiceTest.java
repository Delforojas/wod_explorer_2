package com.wodexplorer2.backend;

import com.wodexplorer2.backend.entity.AuthProvider;
import com.wodexplorer2.backend.entity.OAuthLoginHandoff;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.exception.UnauthorizedException;
import com.wodexplorer2.backend.repository.OAuthLoginHandoffRepository;
import com.wodexplorer2.backend.service.OAuthLoginHandoffService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.eq;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class OAuthLoginHandoffServiceTest {

  @Mock
  private OAuthLoginHandoffRepository handoffRepository;

  @Test
  void consumesAValidHandoffOnlyOnce() {
    OAuthLoginHandoffService service = new OAuthLoginHandoffService(handoffRepository, 300);
    User user = new User("google-user", "google@example.com", null);
    OAuthLoginHandoff handoff = new OAuthLoginHandoff(
        "hash",
        "binding-hash",
        user,
        AuthProvider.GOOGLE,
        "/",
        LocalDateTime.now(ZoneOffset.UTC).plusMinutes(5));

    when(handoffRepository.consumeIfValid(anyString(), anyString())).thenReturn(1);
    when(handoffRepository.findByTokenHash(anyString())).thenReturn(Optional.of(handoff));

    User consumedUser = service.consume("opaque-code", AuthProvider.GOOGLE, "browser-session");

    assertThat(consumedUser).isSameAs(user);
    verify(handoffRepository).consumeIfValid(
        eq(sha256("opaque-code")),
        eq(sha256("browser-session")));
  }

  @Test
  void rejectsReplayOrExpiredHandoff() {
    OAuthLoginHandoffService service = new OAuthLoginHandoffService(handoffRepository, 300);
    when(handoffRepository.consumeIfValid(anyString(), anyString())).thenReturn(0);

    assertThatThrownBy(() -> service.consume(
        "opaque-code", AuthProvider.GOOGLE, "browser-session"))
        .isInstanceOf(UnauthorizedException.class)
        .hasMessage("El enlace de acceso de Google no es válido o ha expirado.");
  }

  @Test
  void createsOpaqueCodeAndPersistsOnlyItsHash() {
    OAuthLoginHandoffService service = new OAuthLoginHandoffService(handoffRepository, 300);
    User user = new User("google-user", "google@example.com", null);

    String rawCode = service.create(user, AuthProvider.GOOGLE, "browser-session");

    assertThat(rawCode).isNotBlank();
    org.mockito.ArgumentCaptor<OAuthLoginHandoff> captor =
        org.mockito.ArgumentCaptor.forClass(OAuthLoginHandoff.class);
    verify(handoffRepository).save(captor.capture());

    OAuthLoginHandoff saved = captor.getValue();
    assertThat(ReflectionTestUtils.getField(saved, "tokenHash"))
        .isEqualTo(sha256(rawCode));
    assertThat(ReflectionTestUtils.getField(saved, "browserBindingHash"))
        .isEqualTo(sha256("browser-session"));
    assertThat(ReflectionTestUtils.getField(saved, "tokenHash"))
        .isNotEqualTo(rawCode);
  }

  @Test
  void wrongBrowserBindingDoesNotConsumeTheHandoff() {
    OAuthLoginHandoffService service = new OAuthLoginHandoffService(handoffRepository, 300);
    when(handoffRepository.consumeIfValid(anyString(), anyString())).thenReturn(0);

    assertThatThrownBy(() -> service.consume(
        "opaque-code", AuthProvider.GOOGLE, "different-browser-session"))
        .isInstanceOf(UnauthorizedException.class);

    verify(handoffRepository).consumeIfValid(
        eq(sha256("opaque-code")),
        eq(sha256("different-browser-session")));
  }

  private static String sha256(String value) {
    try {
      return java.util.HexFormat.of().formatHex(
          MessageDigest.getInstance("SHA-256")
              .digest(value.getBytes(StandardCharsets.UTF_8)));
    } catch (java.security.NoSuchAlgorithmException exception) {
      throw new AssertionError(exception);
    }
  }
}
