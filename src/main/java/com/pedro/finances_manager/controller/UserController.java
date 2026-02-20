package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.request.UserRequestDTO;
import com.pedro.finances_manager.dto.response.UserResponseDTO;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.service.UserService;

@RestController	
@RequestMapping("/users")
public class UserController {
	
	private UserService userService;
	
	public UserController(UserService userService){
		this.userService = userService;
	}
	
	
	@PostMapping
	public UserResponseDTO create(@RequestBody UserRequestDTO req) {
		
		User u = userService.create(req);
		return  UserResponseDTO.from(u);
	}
	
	@GetMapping
	public List<User> list(){
		return userService.listAll();
	}
	
	

}
