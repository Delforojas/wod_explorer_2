package com.wodexplorer2.backend.repository;
import com.wodexplorer2.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository 

    extends JpaRepository<User, Long> {

  
}

