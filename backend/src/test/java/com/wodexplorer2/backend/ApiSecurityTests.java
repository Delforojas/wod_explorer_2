package com.wodexplorer2.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiSecurityTests {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void privateEndpointRequiresAuthentication() throws Exception {
    mockMvc.perform(get("/api/test/private"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
  }

  @Test
  void invalidJwtIsHandledAsUnauthenticated() throws Exception {
    mockMvc.perform(get("/api/test/private")
            .header("Authorization", "Bearer invalid-token"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
  }

  @Test
  void exerciseCatalogIsPublic() throws Exception {
    mockMvc.perform(get("/api/exercises"))
        .andExpect(status().isOk());
  }

  @Test
  void exerciseWritesRequireAuthentication() throws Exception {
    mockMvc.perform(post("/api/exercises")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void wodCatalogIsPublicButWritesRequireAuthentication() throws Exception {
    mockMvc.perform(get("/api/wods"))
        .andExpect(status().isOk());

    mockMvc.perform(post("/api/wods")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Privado\"}"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void resultsArePrivate() throws Exception {
    mockMvc.perform(get("/api/wod-results"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void userResponsesDoNotExposePasswordHash() throws Exception {
    String username = "security-" + UUID.randomUUID().toString().substring(0, 8);
    String token = mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"" + username
                + "\",\"email\":\"" + username + "@example.com"
                + "\",\"password\":\"strong-password\"}"))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();

    mockMvc.perform(get("/api/users").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value(username))
        .andExpect(result -> org.junit.jupiter.api.Assertions.assertFalse(
            result.getResponse().getContentAsString().contains("passwordHash")));
  }
}
