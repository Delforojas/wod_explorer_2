package com.wodexplorer2.backend;

import com.wodexplorer2.backend.entity.AuthProvider;
import com.wodexplorer2.backend.entity.OAuthLoginHandoff;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.exception.UnauthorizedException;
import com.wodexplorer2.backend.repository.OAuthLoginHandoffRepository;
import com.wodexplorer2.backend.repository.UserRepository;
import com.wodexplorer2.backend.service.OAuthLoginHandoffService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.security.MessageDigest;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OAuthLoginHandoffIntegrationTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OAuthLoginHandoffRepository handoffRepository;

  @Autowired
  private OAuthLoginHandoffService handoffService;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Test
  void migrationSupportsProviderOnlyUsersAndBrowserBindingColumn() {
    Integer nullablePasswordHash = jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM information_schema.columns "
            + "WHERE table_schema = DATABASE() AND table_name = 'users' "
            + "AND column_name = 'password_hash' AND is_nullable = 'YES'",
        Integer.class);
    Integer browserBindingColumn = jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM information_schema.columns "
            + "WHERE table_schema = DATABASE() AND table_name = 'oauth_login_handoffs' "
            + "AND column_name = 'browser_binding_hash'",
        Integer.class);

    assertThat(nullablePasswordHash).isEqualTo(1);
    assertThat(browserBindingColumn).isEqualTo(1);
  }

  @Test
  void wrongSessionDoesNotConsumeTheLegitimateHandoff() throws Exception {
    User user = saveUser();
    MockHttpSession legitimateSession = new MockHttpSession(null, "legitimate-session");
    MockHttpSession otherSession = new MockHttpSession(null, "other-session");
    String code = handoffService.create(user, AuthProvider.GOOGLE, legitimateSession.getId());

    mockMvc.perform(post("/api/auth/google/exchange")
            .session(otherSession)
            .contentType("application/json")
            .content("{\"code\":\"" + code + "\"}"))
        .andExpect(status().isUnauthorized());

    mockMvc.perform(post("/api/auth/google/exchange")
            .session(legitimateSession)
            .contentType("application/json")
            .content("{\"code\":\"" + code + "\"}"))
        .andExpect(status().isOk());

    assertThatThrownBy(() -> handoffService.consume(
        code, AuthProvider.GOOGLE, legitimateSession.getId()))
        .isInstanceOf(UnauthorizedException.class);
  }

  @Test
  void expiredHandoffIsRejectedByTheDatabasePredicate() {
    User user = saveUser();
    String codeHash = sha256("expired-code");
    String bindingHash = sha256("expired-session");
    handoffRepository.saveAndFlush(new OAuthLoginHandoff(
        codeHash,
        bindingHash,
        user,
        AuthProvider.GOOGLE,
        "/",
        LocalDateTime.now(ZoneOffset.UTC).minusSeconds(1)));

    assertThatThrownBy(() -> handoffService.consume(
        "expired-code", AuthProvider.GOOGLE, "expired-session"))
        .isInstanceOf(UnauthorizedException.class);
  }

  private User saveUser() {
    String suffix = UUID.randomUUID().toString().substring(0, 8);
    return userRepository.saveAndFlush(new User(
        "handoff-security-" + suffix,
        "handoff-security-" + suffix + "@example.com",
        null));
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
