package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.UserResponse;
import com.wodexplorer2.backend.dto.UserUpdateRequest;
import jakarta.validation.Valid;
import com.wodexplorer2.backend.service.UserService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse findCurrent() {
        return toResponse(userService.findCurrent());
    }

    @GetMapping("/{id}")
    public UserResponse findById(@PathVariable Long id) {
        return toResponse(userService.requireOwned(id));
    }

    @PutMapping("/{id}")
    public UserResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        return toResponse(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    private UserResponse toResponse(com.wodexplorer2.backend.entity.User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt());
    }
}
