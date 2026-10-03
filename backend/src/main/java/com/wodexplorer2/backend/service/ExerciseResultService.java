package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.ExerciseResultRequest;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.ExerciseResult;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;
import com.wodexplorer2.backend.mapper.ExerciseResultMapper;
import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.repository.ExerciseResultRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ExerciseResultService {

    private final ExerciseResultRepository exerciseResultRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseResultMapper exerciseResultMapper;
    private final CurrentUserService currentUserService;

    public ExerciseResultService(
            ExerciseResultRepository exerciseResultRepository,
            ExerciseRepository exerciseRepository,
            ExerciseResultMapper exerciseResultMapper,
            CurrentUserService currentUserService) {
        this.exerciseResultRepository = exerciseResultRepository;
        this.exerciseRepository = exerciseRepository;
        this.exerciseResultMapper = exerciseResultMapper;
        this.currentUserService = currentUserService;
    }

    public List<ExerciseResult> findAll() {
        return exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(
                currentUserService.require().getId());
    }

    public ExerciseResult findById(Long id) {
        return requireOwned(id);
    }

    public ExerciseResult create(ExerciseResultRequest request) {
        User user = currentUserService.require();

        Exercise exercise = exerciseRepository.findByIdAndActiveTrue(request.exerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Ejercicio no encontrado"));

        validateResult(request, exercise);

        return exerciseResultRepository.save(
                exerciseResultMapper.toEntity(request, user, exercise));
    }

    public void deleteById(Long id) {
        exerciseResultRepository.delete(requireOwned(id));
    }

    private void validateResult(
            ExerciseResultRequest request,
            Exercise exercise) {

        switch (exercise.getMeasurementType()) {

            case WEIGHT -> {
                if (request.reps() == null || request.weightKg() == null) {
                    throw new IllegalArgumentException(
                            "Un resultado de peso requiere repeticiones y peso");
                }

                if (request.distanceM() != null || request.durationSeconds() != null) {
                    throw new IllegalArgumentException(
                            "Un resultado de peso solo puede contener repeticiones y peso");
                }
            }

            case REPS -> {
                if (request.reps() == null) {
                    throw new IllegalArgumentException(
                            "Un resultado de repeticiones requiere repeticiones");
                }

                if (request.weightKg() != null
                        || request.distanceM() != null
                        || request.durationSeconds() != null) {
                    throw new IllegalArgumentException(
                            "Un resultado de repeticiones solo puede contener repeticiones");
                }
            }

            case TIME -> {
                if (request.durationSeconds() == null) {
                    throw new IllegalArgumentException(
                            "Un resultado de tiempo requiere duración");
                }

                if (request.reps() != null
                        || request.weightKg() != null
                        || request.distanceM() != null) {
                    throw new IllegalArgumentException(
                            "Un resultado de tiempo solo puede contener duración");
                }
            }

            case DISTANCE -> {
                if (request.distanceM() == null) {
                    throw new IllegalArgumentException(
                            "Un resultado de distancia requiere distancia");
                }

                if (request.reps() != null
                        || request.weightKg() != null
                        || request.durationSeconds() != null) {
                    throw new IllegalArgumentException(
                            "Un resultado de distancia solo puede contener distancia");
                }
            }

            case WEIGHT_DISTANCE -> {
                if (request.weightKg() == null || request.distanceM() == null) {
                    throw new IllegalArgumentException(
                            "Un resultado de peso y distancia requiere peso y distancia");
                }

                if (request.reps() != null || request.durationSeconds() != null) {
                    throw new IllegalArgumentException(
                            "Un resultado de peso y distancia solo puede contener peso y distancia");
                }
            }
        }
    }

    private ExerciseResult requireOwned(Long id) {
        User currentUser = currentUserService.require();

        ExerciseResult result = exerciseResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resultado de ejercicio no encontrado"));

        if (!result.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException(
                    "No tienes permisos para acceder a este resultado");
        }

        return result;
    }
}