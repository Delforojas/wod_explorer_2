package com.wodexplorer2.backend;

import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.repository.UserRepository;
import com.wodexplorer2.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProviderOnlySecurityTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private JwtService jwtService;

  @Test
  void googleProviderOnlyUserCanAccessPrivateEndpointWithJwt() throws Exception {
    User user = saveUser(null, "google");

    mockMvc.perform(get("/api/users")
            .header("Authorization", "Bearer " + jwtService.generateToken(user.getUsername())))
        .andExpect(status().isOk());
  }

  @Test
  void localUserCanAccessPrivateEndpointWithJwt() throws Exception {
    User user = saveUser("$2a$10$7EqJtq98hPqEX7fNZaFWoO5kJ7l1Qj1n1fXQ4Wb0nJ2fK3mY8XQ7K", "local");

    mockMvc.perform(get("/api/users")
            .header("Authorization", "Bearer " + jwtService.generateToken(user.getUsername())))
        .andExpect(status().isOk());
  }

  @Test
  void providerOnlyUserCannotUseLocalPasswordLogin() throws Exception {
    User user = saveUser(null, "password");

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"" + user.getUsername()
                + "\",\"password\":\"any-password\"}"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void privateEndpointWithoutSessionRemainsUnauthorized() throws Exception {
    mockMvc.perform(get("/api/users"))
        .andExpect(status().isUnauthorized());
  }

  private User saveUser(String passwordHash, String kind) {
    String suffix = UUID.randomUUID().toString().substring(0, 8);
    return userRepository.saveAndFlush(new User(
        "security-" + kind + "-" + suffix,
        "security-" + kind + "-" + suffix + "@example.com",
        passwordHash));
  }
}
