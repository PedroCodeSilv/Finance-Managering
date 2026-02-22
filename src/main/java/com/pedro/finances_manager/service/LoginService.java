package com.pedro.finances_manager.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.request.LoginRequestDTO;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class LoginService {
	
	
	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	public LoginService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		
	}
	
	public User loginAuth(LoginRequestDTO req) {
	
		User user = userRepository.findByEmail(req.email().toLowerCase()).orElseThrow(()-> new RuntimeException());

		boolean sera = passwordEncoder.matches(req.password(), user.getPasswordHash());
		System.out.println(sera);
		
		
		if(!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
			
			throw new RuntimeException("Email/Senha inválidos");
		}
		

		
		return user;
	}
	
	

}
