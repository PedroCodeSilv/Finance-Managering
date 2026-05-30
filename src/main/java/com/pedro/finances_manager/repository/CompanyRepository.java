package com.pedro.finances_manager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    List<Company> findByUserId(Long userId);

    Optional<Company> findByIdAndUserId(Long id, Long userId);
}
