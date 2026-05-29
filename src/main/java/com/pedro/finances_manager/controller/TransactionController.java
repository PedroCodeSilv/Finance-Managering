package com.pedro.finances_manager.controller;

import com.pedro.finances_manager.dto.report.TransactionByCategory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.pedro.finances_manager.dto.transaction.request.TransactionRequestDTO;
import com.pedro.finances_manager.dto.transaction.response.TransactionResponseDTO;
import com.pedro.finances_manager.security.JWTUserData;
import com.pedro.finances_manager.service.TransactionService;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
	
	private final TransactionService transactionService;



    public TransactionController(TransactionService transactionService
			 ) {
		this.transactionService = transactionService;

	}
	
	@PostMapping("/user")
	public TransactionResponseDTO create(@RequestBody TransactionRequestDTO req,
										 @AuthenticationPrincipal JWTUserData user) {
		

		return transactionService.create(req, user.userId());
		
	}
	@GetMapping
	public List<TransactionByCategory> showAll(JWTUserData user){
		return transactionService.showTransactionByCategory(user.userId());
	}
	@GetMapping("/test/{num}")
	public List<TransactionByCategory> showAllTwo(@PathVariable Long num){
        return transactionService.showTransactionByCategoryTwo(num);
	}

}
