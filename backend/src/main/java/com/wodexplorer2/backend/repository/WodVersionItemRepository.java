package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.WodVersionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WodVersionItemRepository
        extends JpaRepository<WodVersionItem, Long> {

    List<WodVersionItem> findByWodVersionIdOrderByPositionAsc(Long wodVersionId);
}
