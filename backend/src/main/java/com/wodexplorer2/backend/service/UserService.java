package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.repository.UserRepository;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.dto.UserUpdateRequest;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.ConflictException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final CurrentUserService currentUserService;

  public UserService(
      UserRepository userRepository,
      CurrentUserService currentUserService) {
    this.userRepository = userRepository;
    this.currentUserService = currentUserService;
  }

  public User findCurrent() {
    return currentUserService.require();
  }

  public User requireOwned(Long id) {
    User current = currentUserService.require();
    if (!current.getId().equals(id)) {
      throw new ForbiddenException("No tienes permisos para acceder a este usuario");
    }
    return userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
  }

  public User update(Long id, UserUpdateRequest request) {
    User existingUser = requireOwned(id);
    if (!existingUser.getUsername().equals(request.username())
        && userRepository.existsByUsername(request.username())) {
      throw new ConflictException("El nombre de usuario ya existe");
    }
    if (!existingUser.getEmail().equals(request.email())
        && userRepository.existsByEmail(request.email())) {
      throw new ConflictException("El correo electrónico ya existe");
    }
    existingUser.update(request.username(), request.email());

    return userRepository.save(existingUser);
  }

  public void delete(Long id) {
    userRepository.delete(requireOwned(id));
  }
}
