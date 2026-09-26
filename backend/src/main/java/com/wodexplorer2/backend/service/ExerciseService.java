package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.entity.Exercise;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service

public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public List<Exercise> findPublic() {
        return exerciseRepository.findByActiveTrue();
    }

    public Exercise findPublicById(Long id) {
        return exerciseRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new com.wodexplorer2.backend.exception.ResourceNotFoundException(
                        "Ejercicio no encontrado"));
    }

    // CREATE
    public Exercise create(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    // UPDATE
    public Exercise update(Long id, Exercise exercise) {

        Exercise existingExercise = exerciseRepository.findById(id)
                .orElseThrow();

        existingExercise.update(
                exercise.getName(),
                exercise.getCategory(),
                exercise.getMeasurementType());

        return exerciseRepository.save(existingExercise);
    }

    // DELETE
    public void deleteById(Long id) {
        exerciseRepository.deleteById(id);
    }
}
