package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.request.TransactionRequestDTO;
import com.pedro.finances_manager.dto.response.TransactionResponseDTO;
import com.pedro.finances_manager.entities.Transaction;
import com.pedro.finances_manager.service.TransactionService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
	
	public TransactionService transactionService;
	
	public TransactionController(TransactionService transactionService) {
		this.transactionService = transactionService;
	}
	
	@PostMapping("users/{id}")
	public TransactionResponseDTO create(@RequestBody TransactionRequestDTO req, @PathVariable Long id) {
		
		Transaction t = transactionService.create(req, id);
		return TransactionResponseDTO.from(t);
		
	}
	
	@GetMapping("users/{userId}/transactions")
	public List<Transaction> listAll(@PathVariable Long userId){
		return transactionService.listAll(userId);
	}
	

}
