package com.pedro.finances_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.request.UserRequestDTO;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class UserService {

	private UserRepository userRepository;
	
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	public User create(UserRequestDTO req) {
		
		User u = new User(
				req.name(),
				req.password(),
				req.email()
				
				);
		return userRepository.save(u);
		
	}
	
	public List<User> listAll(){
		return userRepository.findAll();
		
	}
}
