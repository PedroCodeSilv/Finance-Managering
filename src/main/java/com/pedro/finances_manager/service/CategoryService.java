package com.pedro.finances_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.request.CategoryRequestDTO;
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
	
	public Category create(CategoryRequestDTO req, Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found: " + id));;
		Category c = new Category(
				req.name(),
				req.type(), 
				user
				);
		return categoryRepository.save(c);
	}
	
	public List<Category> listAll(){
		return categoryRepository.findAll();
	}
	

	

}
