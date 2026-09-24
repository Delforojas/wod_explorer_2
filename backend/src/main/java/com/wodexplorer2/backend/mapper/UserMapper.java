package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.UserRequest;
import com.wodexplorer2.backend.dto.UserResponse;
import com.wodexplorer2.backend.entity.User;

import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  // REQUEST DTO → ENTITY
  public User toEntity(
      UserRequest request,
      String passwordHash) {

    return new User(
        request.username(),
        request.email(),
        passwordHash);
  }

  // ENTITY → RESPONSE DTO
  public UserResponse toResponse(User user) {
    return new UserResponse(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getCreatedAt());
  }
}