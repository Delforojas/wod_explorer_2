package com.wodexplorer2.backend.repository;
import com.wodexplorer2.backend.entity.WodVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WodVersionRepository 

    extends JpaRepository<WodVersion, Long> {

    Optional<WodVersion> findTopByWodIdOrderByVersionNumberDesc(Long wodId);
}
