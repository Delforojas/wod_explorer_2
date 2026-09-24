package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.entity.ExerciseResult;
import com.wodexplorer2.backend.service.ExerciseResultService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/exercise-results")
public class ExerciseResultController {

    private final ExerciseResultService exerciseResultService;

    public ExerciseResultController(ExerciseResultService exerciseResultService) {
        this.exerciseResultService = exerciseResultService;
    }

    @GetMapping
    public List<ExerciseResult> findAll() {
        return exerciseResultService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<ExerciseResult> findById(@PathVariable Long id) {
        return exerciseResultService.findById(id);
    }

    @PostMapping
    public ExerciseResult create(@RequestBody ExerciseResult exerciseResult) {
        return exerciseResultService.create(exerciseResult);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        exerciseResultService.deleteById(id);
    }
}