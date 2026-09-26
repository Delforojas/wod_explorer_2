package com.wodexplorer2.backend.repository;
import com.wodexplorer2.backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface ExerciseRepository
        extends JpaRepository<Exercise, Long> {

    List<Exercise> findByActiveTrue();

    Optional<Exercise> findByIdAndActiveTrue(Long id);
}
