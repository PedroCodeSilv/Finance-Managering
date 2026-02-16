package com.pedro.finances_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{

}
