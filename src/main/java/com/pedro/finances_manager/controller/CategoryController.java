package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.entities.Category;
import com.pedro.finances_manager.service.CategoryService;

@RestController
@RequestMapping("/category")
public class CategoryController {
	
	private CategoryService categoryService;
	
	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}
	
	@PostMapping("/users/{id}")
	public Category create(@RequestBody Category category, @PathVariable Long id) {
		return categoryService.create(category, id);
	}
	
	@GetMapping
	public List<Category> listAll() {
		return categoryService.listAll();
	}

}
