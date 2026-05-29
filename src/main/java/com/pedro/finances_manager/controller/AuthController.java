package com.pedro.finances_manager.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.auth.request.LoginRequestDTO;
import com.pedro.finances_manager.dto.auth.response.LoginResponseDTO;
import com.pedro.finances_manager.service.AuthService;


@RestController
@RequestMapping("api/auth")
public class AuthController {
	
	final private AuthService authService;
	
	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public LoginResponseDTO authLogin(@RequestBody LoginRequestDTO req) {
	
		
		return  authService.loginAuth(req);
	}
}
