package com.pedro.finances_manager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	
	Optional<Category> findByIdAndUserId(Long id, Long userId);

}
