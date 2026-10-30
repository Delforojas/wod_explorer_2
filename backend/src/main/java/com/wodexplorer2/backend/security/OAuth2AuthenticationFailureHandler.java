package com.wodexplorer2.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

  private final String frontendUrl;

  public OAuth2AuthenticationFailureHandler(
      @Value("${app.frontend-url}") String frontendUrl) {
    this.frontendUrl = frontendUrl.replaceAll("/+$", "");
  }

  @Override
  public void onAuthenticationFailure(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException exception) throws IOException, ServletException {
    response.sendRedirect(frontendUrl + "/auth/google/callback?error=oauth_failed");
  }
}
