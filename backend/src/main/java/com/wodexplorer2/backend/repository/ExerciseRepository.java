package com.wodexplorer2.backend.repository;
import com.wodexplorer2.backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ExerciseRepository
        extends JpaRepository<Exercise, Long> {

}