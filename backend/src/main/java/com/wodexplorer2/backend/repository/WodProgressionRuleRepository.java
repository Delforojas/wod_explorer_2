package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.WodProgressionRule;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WodProgressionRuleRepository extends JpaRepository<WodProgressionRule, Long> {
  List<WodProgressionRule> findByWodVersion_IdIn(Collection<Long> wodVersionIds);
}
