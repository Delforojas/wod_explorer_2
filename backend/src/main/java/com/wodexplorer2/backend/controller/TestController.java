package com.wodexplorer2.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

  @GetMapping("/private")
  public ResponseEntity<String> privateEndpoint() {
    return ResponseEntity.ok("Acceso autorizado");
  }
}