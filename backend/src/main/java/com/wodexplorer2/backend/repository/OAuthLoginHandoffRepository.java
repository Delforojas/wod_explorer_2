package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.OAuthLoginHandoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OAuthLoginHandoffRepository extends JpaRepository<OAuthLoginHandoff, Long> {

  Optional<OAuthLoginHandoff> findByTokenHash(String tokenHash);

  @Modifying(clearAutomatically = true)
  @Query(value = """
      UPDATE oauth_login_handoffs
      SET consumed_at = UTC_TIMESTAMP(6)
      WHERE token_hash = :tokenHash
        AND browser_binding_hash = :browserBindingHash
        AND consumed_at IS NULL
        AND expires_at > UTC_TIMESTAMP(6)
      """, nativeQuery = true)
  int consumeIfValid(
      @Param("tokenHash") String tokenHash,
      @Param("browserBindingHash") String browserBindingHash);
}
