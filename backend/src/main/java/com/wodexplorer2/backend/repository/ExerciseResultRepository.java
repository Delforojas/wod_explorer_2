package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.ExerciseResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ExerciseResultRepository
        extends JpaRepository<ExerciseResult, Long> {

    List<ExerciseResult> findByUserIdOrderByPerformedAtDesc(Long userId);

    Optional<ExerciseResult> findByIdAndUserId(Long id, Long userId);
}
