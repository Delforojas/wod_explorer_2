package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.ExerciseResultRequest;
import com.wodexplorer2.backend.dto.ExerciseResultResponse;
import com.wodexplorer2.backend.mapper.ExerciseResultMapper;
import jakarta.validation.Valid;
import com.wodexplorer2.backend.service.ExerciseResultService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise-results")
public class ExerciseResultController {

    private final ExerciseResultService exerciseResultService;
    private final ExerciseResultMapper exerciseResultMapper;

    public ExerciseResultController(
            ExerciseResultService exerciseResultService,
            ExerciseResultMapper exerciseResultMapper) {
        this.exerciseResultService = exerciseResultService;
        this.exerciseResultMapper = exerciseResultMapper;
    }

    @GetMapping
    public List<ExerciseResultResponse> findAll() {
        return exerciseResultService.findAll().stream()
                .map(exerciseResultMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ExerciseResultResponse findById(@PathVariable Long id) {
        return exerciseResultMapper.toResponse(exerciseResultService.findById(id));
    }

    @PostMapping
    public ExerciseResultResponse create(@Valid @RequestBody ExerciseResultRequest request) {
        return exerciseResultMapper.toResponse(exerciseResultService.create(request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        exerciseResultService.deleteById(id);
    }
}
