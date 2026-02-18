package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.request.TransictionRequest;
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
	public Transaction create(@RequestBody TransictionRequest req, @PathVariable Long id) {
		return transactionService.create(req, id);
		
	}
	
	@GetMapping
	public List<Transaction> listAll(){
		return transactionService.listAll();
	}
	

}
