package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.exception.UnauthorizedException;
import com.wodexplorer2.backend.repository.UserRepository;
import java.util.Optional;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

  private final UserRepository userRepository;

  public CurrentUserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Optional<User> find() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null
        || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken) {
      return Optional.empty();
    }

    return userRepository.findByUsername(authentication.getName());
  }

  public User require() {
    return find().orElseThrow(() -> new UnauthorizedException("Autenticación requerida"));
  }
}
