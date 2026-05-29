package com.pedro.finances_manager.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.user.request.UserRequestDTO;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class UserService {

	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	
	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}
	
	public User create(UserRequestDTO req) {
		
		User u = new User(
				req.name(),
				passwordEncoder.encode(req.password()),
				req.email()
				
				);
		return userRepository.save(u);
		
	}
	

}
