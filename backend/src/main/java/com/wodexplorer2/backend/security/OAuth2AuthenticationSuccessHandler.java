package com.wodexplorer2.backend.security;

import com.wodexplorer2.backend.service.GoogleOAuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler
    implements AuthenticationSuccessHandler {

  private final GoogleOAuthService googleOAuthService;
  private final String frontendUrl;

  public OAuth2AuthenticationSuccessHandler(
      GoogleOAuthService googleOAuthService,
      @Value("${app.frontend-url}") String frontendUrl) {

    this.googleOAuthService = googleOAuthService;
    this.frontendUrl = frontendUrl;
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

    String token = googleOAuthService.loginWithGoogle(
        providerUserId,
        email);

    response.sendRedirect(
        frontendUrl + "/auth/google/callback#token=" + token);
  }
}