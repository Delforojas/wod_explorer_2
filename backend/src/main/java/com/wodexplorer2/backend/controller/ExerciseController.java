package com.wodexplorer2.backend.controller;

import java.util.Optional;
import com.wodexplorer2.backend.service.ExerciseService;
import com.wodexplorer2.backend.entity.Exercise;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

  private final ExerciseService exerciseService;

  public ExerciseController(ExerciseService exerciseService) {
    this.exerciseService = exerciseService;
  }

  @GetMapping
  public List<Exercise> findAll() {
    return exerciseService.findAll();
  }

  @GetMapping("/{id}")
  public Optional<Exercise> findById(@PathVariable Long id) {
    return exerciseService.findById(id);
  }

  @PostMapping
  public Exercise create(@RequestBody Exercise exercise) {
    return exerciseService.create(exercise);
  }

  @PutMapping("/{id}")
  public Exercise update(
      @PathVariable Long id,
      @RequestBody Exercise exercise) {

    return exerciseService.update(id, exercise);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    exerciseService.deleteById(id);
  }
}
