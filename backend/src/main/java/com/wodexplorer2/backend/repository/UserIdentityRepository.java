package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.AuthProvider;
import com.wodexplorer2.backend.entity.UserIdentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserIdentityRepository extends JpaRepository<UserIdentity, Long> {

  Optional<UserIdentity> findByProviderAndProviderUserId(
      AuthProvider provider,
      String providerUserId);

  Optional<UserIdentity> findByUserIdAndProvider(
      Long userId,
      AuthProvider provider);
}