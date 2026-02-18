package com.pedro.finances_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{

}
