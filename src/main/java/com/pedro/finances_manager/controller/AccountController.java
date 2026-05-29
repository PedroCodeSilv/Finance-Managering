package com.pedro.finances_manager.controller;

import com.pedro.finances_manager.dto.account.collection.AccountFindByCategory;
import com.pedro.finances_manager.security.JWTUserData;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.pedro.finances_manager.dto.account.request.AccountRequestDTO;
import com.pedro.finances_manager.dto.account.response.AccountResponseDTO;
import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.service.AccountService;

@RestController
@RequestMapping("/account")
public class AccountController {
	
	private final AccountService accountService;

	
	public AccountController(AccountService accountService
							 ) {
		this.accountService=accountService;

	}
	
	@PostMapping("/user")
	public AccountResponseDTO create(@RequestBody AccountRequestDTO req,
									 @AuthenticationPrincipal JWTUserData user) {
		Account account = accountService.create(req, user);
		return AccountResponseDTO.from(account);
	}
	@GetMapping("/test")
	public List<AccountFindByCategory> find(@AuthenticationPrincipal JWTUserData user){
		return accountService.createListAccountReport(user.userId());

	}

}
