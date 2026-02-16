package com.pedro.finances_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {

}
