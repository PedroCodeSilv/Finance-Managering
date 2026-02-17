package com.pedro.finances_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
