package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.service.AccountService;

@RestController
@RequestMapping("/account")
public class AccountController {
	
	private AccountService accountService;
	
	public AccountController(AccountService accountService) {
		this.accountService=accountService;
	}
	
	@PostMapping("/users/{id}")
	public Account create(@RequestBody Account account, @PathVariable Long id) {
		return accountService.create(account, id);
	}
	
	@GetMapping
	public List<Account> findAll() {
		return accountService.listAll();
	}
	

}
