package com.pedro.finances_manager.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.request.LoginRequestDTO;
import com.pedro.finances_manager.dto.response.LoginResponseDTO;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.UserRepository;
import com.pedro.finances_manager.security.TokenConfig;
import com.pedro.finances_manager.security.UserValidator;

@Service
public class AuthService {
	
	public final UserRepository userRepository;
	public final AuthenticationManager authenticationManager;
	public final PasswordEncoder passwordEncoder;
	public final TokenConfig tokenConfig;
	
	public AuthService(UserRepository userRespository,
			AuthenticationManager authenticationManager,
			PasswordEncoder passwordEncoder,
			TokenConfig tokenConfig) {
		this.userRepository = userRespository;
		this.authenticationManager = authenticationManager;
		this.passwordEncoder = passwordEncoder;
		this.tokenConfig = tokenConfig;
	}
	


	public LoginResponseDTO loginAuth(LoginRequestDTO req) {
		
		UsernamePasswordAuthenticationToken userAndPass= new UsernamePasswordAuthenticationToken(req.email(), req.password()) ;
		Authentication authentication = authenticationManager.authenticate(userAndPass);
		UserValidator principal = (UserValidator) authentication.getPrincipal();
		
		User userToken = principal.getUser();
		String token = tokenConfig.generetionToken(userToken);
		
		
		return new LoginResponseDTO(token);
	}
	
	

}
