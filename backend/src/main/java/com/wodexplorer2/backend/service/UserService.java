package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.repository.UserRepository;
import com.wodexplorer2.backend.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // READ ALL
  public List<User> findAll() {
    return userRepository.findAll();
  }

  // READ ONE
  public Optional<User> findById(Long id) {
    return userRepository.findById(id);
  }

  // CREATE
  public User create(User user) {
    return userRepository.save(user);
  }

  // UPDATE
  public User update(Long id, User user) {

    User existingUser = userRepository.findById(id)
        .orElseThrow();

    existingUser.update(
        user.getUsername(),
        user.getEmail());

    return userRepository.save(existingUser);
  }

  // DELETE
  public void deleteById(Long id) {
    userRepository.deleteById(id);
  }
}