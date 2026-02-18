package com.pedro.finances_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.request.TransictionRequest;
import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.entities.Category;
import com.pedro.finances_manager.entities.Transaction;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.AccountRepository;
import com.pedro.finances_manager.repository.CategoryRepository;
import com.pedro.finances_manager.repository.TransactionRepository;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class TransactionService {

	private TransactionRepository transactionRepository;
	private UserRepository userRepository;
	private AccountRepository accountRepository;
	private CategoryRepository categoryRepository;

	public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository,
			AccountRepository accountRepository, CategoryRepository categoryRepository) {
		this.transactionRepository = transactionRepository;
		this.userRepository = userRepository;
		this.accountRepository = accountRepository;
		this.categoryRepository = categoryRepository;
	}

	public Transaction create(TransictionRequest req, Long id) {

		if ( req.getCategoryId() == null) {
		    throw new RuntimeException("categoryId é obrigatório");
		}

		if (req.getAccountId() == null) {
		    throw new RuntimeException("accountId é obrigatório");
		}

		Account account = accountRepository.findById(req.getAccountId())
				.orElseThrow(() -> new RuntimeException("Conta não encontrada para esse usuario"));
		Category category = categoryRepository.findById(req.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Categoria não encontrada para essa conta"));
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not fund!: " + id));

		Transaction t = new Transaction(
				req.getAmount(),
				req.getDescription(),
				user,
				account,
				category
				);
		

		return transactionRepository.save(t);
	}

	public List<Transaction> listAll() {
		return transactionRepository.findAll();
	}

}
