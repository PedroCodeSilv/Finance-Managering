package com.pedro.finances_manager.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.UserRepository;

@Service

public class CustomUserDetailsService implements UserDetailsService {
	
	public UserRepository userRepository;
	
	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username).orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));
		
		return new UserValidator(user);
	}
	

}
