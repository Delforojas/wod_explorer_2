package com.wodexplorer2.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "oauth_login_handoffs", indexes = {
    @Index(name = "idx_oauth_handoffs_expires_at", columnList = "expires_at")
})
public class OAuthLoginHandoff {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "token_hash", nullable = false, unique = true, length = 64)
  private String tokenHash;

  @Column(name = "browser_binding_hash", length = 64)
  private String browserBindingHash;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(name = "provider", nullable = false, length = 50)
  private AuthProvider provider;

  @Column(name = "redirect_path", nullable = false, length = 255)
  private String redirectPath;

  @Column(name = "expires_at", nullable = false)
  private LocalDateTime expiresAt;

  @Column(name = "consumed_at")
  private LocalDateTime consumedAt;

  @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
  private LocalDateTime createdAt;

  protected OAuthLoginHandoff() {
  }

  public OAuthLoginHandoff(
      String tokenHash,
      String browserBindingHash,
      User user,
      AuthProvider provider,
      String redirectPath,
      LocalDateTime expiresAt) {
    this.tokenHash = tokenHash;
    this.browserBindingHash = browserBindingHash;
    this.user = user;
    this.provider = provider;
    this.redirectPath = redirectPath;
    this.expiresAt = expiresAt;
  }

  public User getUser() {
    return user;
  }

  public AuthProvider getProvider() {
    return provider;
  }
}
