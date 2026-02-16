package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public User create(@RequestBody User user) {
		return userService.create(user);
	}
	
	@GetMapping
	public List<User> list(){
		return userService.listAll();
	}
	
	

}
