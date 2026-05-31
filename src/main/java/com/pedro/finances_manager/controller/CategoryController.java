package com.pedro.finances_manager.controller;

import java.util.List;

import com.pedro.finances_manager.security.JWTUserData;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.category.request.CategoryRequestDTO;
import com.pedro.finances_manager.dto.category.response.CategoryResponseDTO;
import com.pedro.finances_manager.service.CategoryService;

@RestController
@RequestMapping("/category")
public class CategoryController {
	
	private final CategoryService categoryService;
	
	public CategoryController(CategoryService categoryService) {

		this.categoryService = categoryService;
	}
	
	@PostMapping("/user")
	public CategoryResponseDTO create(@RequestBody CategoryRequestDTO req,
									  @AuthenticationPrincipal JWTUserData user) {
		return categoryService.create(req, user.userId());
	}

	@GetMapping
	public List<CategoryResponseDTO> findAll(@AuthenticationPrincipal JWTUserData user){


		return categoryService.findAll(user.userId());
	}
	

}
