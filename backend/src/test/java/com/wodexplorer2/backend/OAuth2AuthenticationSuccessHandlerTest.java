package com.wodexplorer2.backend;

import com.wodexplorer2.backend.service.GoogleOAuthService;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OAuth2AuthenticationSuccessHandlerTest {

  @Test
  void redirectsWithHandoffBoundToTheCurrentSession() throws Exception {
    GoogleOAuthService service = mock(GoogleOAuthService.class);
    OAuth2User oauth2User = mock(OAuth2User.class);
    Authentication authentication = mock(Authentication.class);
    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();
    HttpSession session = new MockHttpSession(null, "oauth-session");

    request.setSession((MockHttpSession) session);
    when(authentication.getPrincipal()).thenReturn(oauth2User);
    when(oauth2User.getAttribute("sub")).thenReturn("google-sub");
    when(oauth2User.getAttribute("email")).thenReturn("user@example.com");
    when(oauth2User.getAttribute("email_verified")).thenReturn(true);
    when(service.createLoginHandoff(
        "google-sub", "user@example.com", true, "oauth-session"))
        .thenReturn("opaque-code");

    new com.wodexplorer2.backend.security.OAuth2AuthenticationSuccessHandler(
        service, "http://localhost:5174")
        .onAuthenticationSuccess(request, response, authentication);

    assertThat(response.getRedirectedUrl())
        .isEqualTo("http://localhost:5174/auth/google/callback?code=opaque-code");
    verify(service).createLoginHandoff(
        eq("google-sub"),
        eq("user@example.com"),
        eq(true),
        eq("oauth-session"));
  }

  @Test
  void redirectsWithRecoverableErrorWhenHandoffCreationFails() throws Exception {
    GoogleOAuthService service = mock(GoogleOAuthService.class);
    OAuth2User oauth2User = mock(OAuth2User.class);
    Authentication authentication = mock(Authentication.class);
    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();
    request.setSession(new MockHttpSession(null, "oauth-session"));
    when(authentication.getPrincipal()).thenReturn(oauth2User);
    when(oauth2User.getAttribute("sub")).thenReturn("google-sub");
    when(oauth2User.getAttribute("email")).thenReturn("user@example.com");
    when(oauth2User.getAttribute("email_verified")).thenReturn(true);
    doThrow(new IllegalStateException()).when(service).createLoginHandoff(
        "google-sub", "user@example.com", true, "oauth-session");

    new com.wodexplorer2.backend.security.OAuth2AuthenticationSuccessHandler(
        service, "http://localhost:5174")
        .onAuthenticationSuccess(request, response, authentication);

    assertThat(response.getRedirectedUrl())
        .isEqualTo("http://localhost:5174/auth/google/callback?error=oauth_failed");
  }
}
