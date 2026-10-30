package com.wodexplorer2.backend;

import com.wodexplorer2.backend.security.OAuth2AuthenticationFailureHandler;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class OAuth2AuthenticationFailureHandlerTest {

  @Test
  void redirectsOAuthCancellationWithoutExposingProviderDetails() throws Exception {
    MockHttpServletResponse response = new MockHttpServletResponse();

    new OAuth2AuthenticationFailureHandler("http://localhost:5174")
        .onAuthenticationFailure(
            new MockHttpServletRequest(),
            response,
            mock(AuthenticationException.class));

    assertThat(response.getRedirectedUrl())
        .isEqualTo("http://localhost:5174/auth/google/callback?error=oauth_failed");
  }
}
