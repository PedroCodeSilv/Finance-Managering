package com.pedro.finances_manager.service;

import java.util.List;

import com.pedro.finances_manager.dto.category.response.CategoryResponseDTO;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.category.request.CategoryRequestDTO;
import com.pedro.finances_manager.entities.Category;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.CategoryRepository;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class CategoryService {
	
	private final CategoryRepository categoryRepository;
	private final UserRepository userRepository;

	public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
		this.categoryRepository = categoryRepository;
		this.userRepository = userRepository;
		
	}
	
	public CategoryResponseDTO create(CategoryRequestDTO req, Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found: " + id));;
		Category c = new Category(
				req.name(),
				req.type(), 
				user
				);
		categoryRepository.save(c);
		return new CategoryResponseDTO(req.name(), req.type());
	}

	public List<CategoryResponseDTO> findAll(Long userId){

        return  categoryRepository.findAllByUserId(userId).stream().map(category ->
				new CategoryResponseDTO(category.getName(), category.getType())).toList();
    }


	

}
