package com.pedro.finances_manager.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.request.LoginRequestDTO;
import com.pedro.finances_manager.dto.response.LoginResponseDTO;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.service.LoginService;


@RestController
@RequestMapping("api/auth/login")
public class LoginController {
	
	private LoginService loginService;
	
	public LoginController(LoginService loginService) {
		this.loginService = loginService;
	}

	@PostMapping
	public LoginResponseDTO authLogin(@RequestBody LoginRequestDTO req) {
		User user = loginService.loginAuth(req);
		return LoginResponseDTO.loginAuth(user);
	}
}
