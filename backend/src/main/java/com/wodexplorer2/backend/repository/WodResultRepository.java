package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.WodResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WodResultRepository extends JpaRepository<WodResult, Long> {

    List<WodResult> findByUserIdOrderByPerformedAtDesc(Long userId);

    Optional<WodResult> findByIdAndUserId(Long id, Long userId);
}
