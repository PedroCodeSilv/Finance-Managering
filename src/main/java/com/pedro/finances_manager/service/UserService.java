package com.pedro.finances_manager.service;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.user.request.UserRequestDTO;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final CategoryService categoryService;
	private final PasswordEncoder passwordEncoder;
	
	public UserService(UserRepository userRepository, CategoryService categoryService, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
        this.categoryService = categoryService;
        this.passwordEncoder = passwordEncoder;

	}

	@Transactional
	public User create(UserRequestDTO req) {

		User user = new User(
				req.name(),
				passwordEncoder.encode(req.password()),
				req.email()
		);

		User savedUser = userRepository.save(user);

		categoryService.createCategoryInit(savedUser);

		return savedUser;
	}

	public User findUser(Long id){

        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
	}

	

}
