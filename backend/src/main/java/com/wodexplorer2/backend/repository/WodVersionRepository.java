package com.wodexplorer2.backend.repository;
import com.wodexplorer2.backend.entity.WodVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WodVersionRepository 

    extends JpaRepository<WodVersion, Long> {

  
}

