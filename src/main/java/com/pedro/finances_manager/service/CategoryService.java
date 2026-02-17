package com.pedro.finances_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedro.finances_manager.entities.Category;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.CategoryRepository;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class CategoryService {
	
	private CategoryRepository categoryRepository;
	private UserRepository userRepository;
	
	public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
		this.categoryRepository = categoryRepository;
		this.userRepository = userRepository;
		
	}
	
	public Category create(Category category, Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found: " + id));;
		category.setUser(user);
		return categoryRepository.save(category);
	}
	
	public List<Category> listAll(){
		return categoryRepository.findAll();
	}
	

	

}
