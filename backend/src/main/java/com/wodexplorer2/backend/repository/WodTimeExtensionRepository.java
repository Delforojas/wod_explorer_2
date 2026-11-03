package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.WodTimeExtension;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WodTimeExtensionRepository extends JpaRepository<WodTimeExtension, Long> {
  List<WodTimeExtension> findByWodVersion_IdIn(Collection<Long> wodVersionIds);
}
