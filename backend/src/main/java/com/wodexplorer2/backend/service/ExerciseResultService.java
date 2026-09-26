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
        return exerciseResultRepository.save(exerciseResultMapper.toEntity(request, user, exercise));
    }

    public void deleteById(Long id) {
        exerciseResultRepository.delete(requireOwned(id));
    }

    private ExerciseResult requireOwned(Long id) {
        User currentUser = currentUserService.require();
        ExerciseResult result = exerciseResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resultado de ejercicio no encontrado"));
        if (!result.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("No tienes permisos para acceder a este resultado");
        }
        return result;
    }
}
