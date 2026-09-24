package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.ExerciseResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseResultRepository
        extends JpaRepository<ExerciseResult, Long> {

}