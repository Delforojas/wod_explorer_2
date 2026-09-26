package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.ExerciseResponse;
import com.wodexplorer2.backend.mapper.ExerciseMapper;
import com.wodexplorer2.backend.service.ExerciseService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

  private final ExerciseService exerciseService;
  private final ExerciseMapper exerciseMapper;

  public ExerciseController(
      ExerciseService exerciseService,
      ExerciseMapper exerciseMapper) {
    this.exerciseService = exerciseService;
    this.exerciseMapper = exerciseMapper;
  }

  @GetMapping
  public List<ExerciseResponse> findAll() {
    return exerciseService.findPublic().stream()
        .map(exerciseMapper::toResponse)
        .toList();
  }

  @GetMapping("/{id}")
  public ExerciseResponse findById(@PathVariable Long id) {
    return exerciseMapper.toResponse(exerciseService.findPublicById(id));
  }
}
