package com.pedro.finances_manager.service;

import java.util.List;

import com.pedro.finances_manager.dto.transaction.response.TransactionResponseDTO;
import com.pedro.finances_manager.dto.report.TransactionByCategory;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.transaction.request.TransactionRequestDTO;
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

	public TransactionResponseDTO create(TransactionRequestDTO req, Long id) {

		if ( req.categoryId() == null) {
		    throw new RuntimeException("categoryId é obrigatório");
		}

		if (req.accountId() == null) {
		    throw new RuntimeException("accountId é obrigatório");
		}
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not fund!: " + id));

		Account account = accountRepository.findByIdAndUserId(req.accountId(), user.getId())
				.orElseThrow(() -> new RuntimeException("Conta não encontrada para esse usuario"));
		Category category = categoryRepository.findByIdAndUserId(req.categoryId(), user.getId())
				.orElseThrow(() -> new RuntimeException("Categoria não encontrada para essa conta"));
		

		Transaction t = new Transaction(
				req.amount(),
				req.description(),
				user,
				account,
				category
				);
		transactionRepository.save(t);

		return new TransactionResponseDTO(t.getId(), t.getAmount(), t.getDescription());
	}

	public List<TransactionByCategory> showTransactionByCategory(Long id){



		return transactionRepository.listAllTransactionByCategoryByUser(id);
	}

	public List<TransactionByCategory> showTransactionByCategoryTwo(Long id){



		return transactionRepository.listAllTransactionByCategoryByUser(id);
	}




}
