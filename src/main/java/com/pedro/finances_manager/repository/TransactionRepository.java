package com.pedro.finances_manager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
	
	List<Transaction> findByUserId(Long userId);

}
