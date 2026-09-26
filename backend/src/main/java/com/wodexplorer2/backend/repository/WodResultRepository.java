package com.wodexplorer2.backend.repository;

import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface WodResultRepository extends JpaRepository<WodResult, Long> {

    @Query("""
        select result
        from WodResult result
        join fetch result.wodVersion version
        join fetch version.wod wod
        where result.user.id = :userId
          and (:wodId is null or wod.id = :wodId)
          and (:type is null or version.type = :type)
          and (:origin is null or wod.origin = :origin)
          and (:fromDate is null or result.performedAt >= :fromDate)
          and (:toDate is null or result.performedAt <= :toDate)
        order by result.performedAt desc, result.id desc
        """)
    List<WodResult> findHistory(
            @Param("userId") Long userId,
            @Param("wodId") Long wodId,
            @Param("type") WodType type,
            @Param("origin") WodOrigin origin,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    Optional<WodResult> findByIdAndUserId(Long id, Long userId);
}
