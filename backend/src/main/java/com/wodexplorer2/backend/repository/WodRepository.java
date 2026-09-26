package com.wodexplorer2.backend.repository;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface WodRepository 

    extends JpaRepository<Wod, Long> {

    @Query("select w from Wod w where w.origin = :origin and w.deletedAt is null")
    List<Wod> findVisibleByOrigin(WodOrigin origin);

    @Query("select w from Wod w where w.owner.id = :ownerId and w.origin = :origin and w.deletedAt is null")
    List<Wod> findVisibleByOwnerAndOrigin(Long ownerId, WodOrigin origin);
}
