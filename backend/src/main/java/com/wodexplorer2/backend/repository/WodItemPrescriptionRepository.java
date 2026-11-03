package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.WodItemPrescription;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WodItemPrescriptionRepository extends JpaRepository<WodItemPrescription, Long> {
  List<WodItemPrescription> findByWodVersionItem_IdInOrderByWodVersionItem_IdAscVariantAsc(
      Collection<Long> wodVersionItemIds);
}
