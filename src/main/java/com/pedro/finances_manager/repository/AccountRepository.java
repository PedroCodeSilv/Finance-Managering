package com.pedro.finances_manager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
	
	Optional<Account> findByIdAndUserId(Long id, Long userId);

}
