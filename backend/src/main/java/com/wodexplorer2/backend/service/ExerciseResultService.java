package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.entity.ExerciseResult;
import com.wodexplorer2.backend.repository.ExerciseResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExerciseResultService {

    private final ExerciseResultRepository exerciseResultRepository;

    public ExerciseResultService(ExerciseResultRepository exerciseResultRepository) {
        this.exerciseResultRepository = exerciseResultRepository;
    }

    // READ ALL
    public List<ExerciseResult> findAll() {
        return exerciseResultRepository.findAll();
    }

    // READ ONE
    public Optional<ExerciseResult> findById(Long id) {
        return exerciseResultRepository.findById(id);
    }

    // CREATE
    public ExerciseResult create(ExerciseResult exerciseResult) {
        return exerciseResultRepository.save(exerciseResult);
    }

    // DELETE
    public void deleteById(Long id) {
        exerciseResultRepository.deleteById(id);
    }
}