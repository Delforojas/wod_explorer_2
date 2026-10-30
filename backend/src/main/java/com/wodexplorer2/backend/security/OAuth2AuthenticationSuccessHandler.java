package com.wodexplorer2.backend.security;

import com.wodexplorer2.backend.service.GoogleOAuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler
    implements AuthenticationSuccessHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(
      OAuth2AuthenticationSuccessHandler.class);

  private final GoogleOAuthService googleOAuthService;
  private final String frontendUrl;

  public OAuth2AuthenticationSuccessHandler(
      GoogleOAuthService googleOAuthService,
      @Value("${app.frontend-url}") String frontendUrl) {

    this.googleOAuthService = googleOAuthService;
    this.frontendUrl = frontendUrl.replaceAll("/+$", "");
  }

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication)
      throws IOException, ServletException {

    OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

    String providerUserId = oauth2User.getAttribute("sub");
    String email = oauth2User.getAttribute("email");
    Boolean emailVerified = oauth2User.getAttribute("email_verified");
    HttpSession session = request.getSession(false);

    try {
      if (session == null) {
        throw new IllegalStateException("No existe una sesión OAuth activa.");
      }

      String handoff = googleOAuthService.createLoginHandoff(
        providerUserId,
        email,
        emailVerified,
        session.getId());

      response.sendRedirect(
          frontendUrl + "/auth/google/callback?code="
              + URLEncoder.encode(handoff, StandardCharsets.UTF_8));
    } catch (RuntimeException exception) {
      LOGGER.error(
          "Google OAuth handoff creation failed; exceptionType={}",
          exception.getClass().getName(),
          exception);
      response.sendRedirect(frontendUrl + "/auth/google/callback?error=oauth_failed");
    }
  }
}
