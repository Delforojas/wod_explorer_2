package com.wodexplorer2.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_identities", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_identities_provider_user", columnNames = { "provider", "provider_user_id" }),
    @UniqueConstraint(name = "uq_user_identities_user_provider", columnNames = { "user_id", "provider" })
})
public class UserIdentity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(name = "provider", nullable = false, length = 50)
  private AuthProvider provider;

  @Column(name = "provider_user_id", nullable = false, length = 255)
  private String providerUserId;

  protected UserIdentity() {
  }

  public UserIdentity(User user, AuthProvider provider, String providerUserId) {
    this.user = user;
    this.provider = provider;
    this.providerUserId = providerUserId;
  }

  public Long getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public AuthProvider getProvider() {
    return provider;
  }

  public void setProvider(AuthProvider provider) {
    this.provider = provider;
  }

  public String getProviderUserId() {
    return providerUserId;
  }

  public void setProviderUserId(String providerUserId) {
    this.providerUserId = providerUserId;
  }
}