package com.wodexplorer2.backend.repository;
import com.wodexplorer2.backend.entity.Wod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WodRepository 

    extends JpaRepository<Wod, Long> {

  
}

