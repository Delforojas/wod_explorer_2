package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.ExerciseResultRequest;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.ExerciseResult;
import com.wodexplorer2.backend.entity.MeasurementType;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;
import com.wodexplorer2.backend.mapper.ExerciseResultMapper;
import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.repository.ExerciseResultRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public List<ExerciseResult> findAll() {
        return exerciseResultRepository.findByUserIdOrderByPerformedAtDesc(
                currentUserService.require().getId());
    }

    @Transactional(readOnly = true)
    public List<ExerciseResult> findPersonalBests() {
        User user = currentUserService.require();
        List<ExerciseResult> results = exerciseResultRepository
                .findByUserIdOrderByPerformedAtDesc(user.getId());
        Map<BestKey, ExerciseResult> bestByKey = new HashMap<>();

        for (ExerciseResult result : results) {
            MeasurementType measurementType = result.getExercise().getMeasurementType();
            if (!isEligibleForPersonalBest(result, measurementType)) {
                continue;
            }

            BestKey key = new BestKey(
                    result.getExercise().getId(),
                    measurementType == MeasurementType.WEIGHT ? result.getReps() : null,
                    measurementType == MeasurementType.DISTANCE_TIME
                            ? result.getDistanceM().stripTrailingZeros()
                            : null);
            ExerciseResult currentBest = bestByKey.get(key);

            if (currentBest == null || isBetter(result, currentBest, measurementType)) {
                bestByKey.put(key, result);
            }
        }

        List<ExerciseResult> bests = new ArrayList<>(bestByKey.values());
        bests.sort(
                Comparator.comparing(ExerciseResult::getPerformedAt)
                        .reversed()
                        .thenComparing(ExerciseResult::getId, Comparator.reverseOrder()));
        return bests;
    }

    public ExerciseResult findById(Long id) {
        return requireOwned(id);
    }

    public ExerciseResult create(ExerciseResultRequest request) {
        User user = currentUserService.require();

        Exercise exercise = exerciseRepository.findByIdAndActiveTrue(request.exerciseId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ejercicio no encontrado"));

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

                if (request.distanceM() != null
                        || request.durationSeconds() != null) {
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

                if (request.reps() != null
                        || request.durationSeconds() != null) {
                    throw new IllegalArgumentException(
                            "Un resultado de peso y distancia solo puede contener peso y distancia");
                }
            }

            case DISTANCE_TIME -> {
                if (request.distanceM() == null
                        || request.durationSeconds() == null) {
                    throw new IllegalArgumentException(
                            "Un resultado de distancia y tiempo requiere distancia y duración");
                }

                if (request.reps() != null
                        || request.weightKg() != null) {
                    throw new IllegalArgumentException(
                            "Un resultado de distancia y tiempo solo puede contener distancia y duración");
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

    private boolean isEligibleForPersonalBest(
            ExerciseResult result,
            MeasurementType measurementType) {
        if (measurementType == MeasurementType.WEIGHT) {
            return result.getReps() != null
                    && result.getWeightKg() != null
                    && result.getDistanceM() == null
                    && result.getDurationSeconds() == null;
        }

        if (measurementType == MeasurementType.REPS) {
            return result.getReps() != null
                    && result.getWeightKg() == null
                    && result.getDistanceM() == null
                    && result.getDurationSeconds() == null;
        }

        if (measurementType == MeasurementType.DISTANCE_TIME) {
            return result.getDistanceM() != null
                    && result.getDistanceM().signum() > 0
                    && result.getDurationSeconds() != null
                    && result.getDurationSeconds() > 0
                    && result.getReps() == null
                    && result.getWeightKg() == null;
        }

        return false;
    }

    private boolean isBetter(
            ExerciseResult candidate,
            ExerciseResult currentBest,
            MeasurementType measurementType) {
        if (measurementType == MeasurementType.DISTANCE_TIME) {
            int durationComparison = Integer.compare(
                    candidate.getDurationSeconds(), currentBest.getDurationSeconds());
            if (durationComparison != 0) {
                return durationComparison < 0;
            }
        } else {
            int valueComparison = measurementType == MeasurementType.WEIGHT
                    ? candidate.getWeightKg().compareTo(currentBest.getWeightKg())
                    : Integer.compare(candidate.getReps(), currentBest.getReps());

            if (valueComparison != 0) {
                return valueComparison > 0;
            }
        }

        int performedAtComparison = candidate.getPerformedAt()
                .compareTo(currentBest.getPerformedAt());
        if (performedAtComparison != 0) {
            return performedAtComparison > 0;
        }

        return candidate.getId() > currentBest.getId();
    }

    private record BestKey(Long exerciseId, Integer reps, BigDecimal distanceM) {
    }
}
