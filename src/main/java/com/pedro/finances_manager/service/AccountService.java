package com.pedro.finances_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.request.AccountRequestDTO;
import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.AccountRepository;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class AccountService {

	private AccountRepository accountRepository;
	private UserRepository userRepository;

	public AccountService(AccountRepository accountRepository, UserRepository userRepository) {

		this.accountRepository = accountRepository;
		this.userRepository = userRepository;

	}

	public Account create(AccountRequestDTO req, Long id) {
		User user = findUserForAccount(id);
		Account account = new Account(
				req.name(),
				req.type(),
				req.currency(),
				user
				
				);
				
		return accountRepository.save(account);
	}

	public List<Account> listAll() {
		return accountRepository.findAll();
	}

	public User findUserForAccount(Long id) {
		  return userRepository.findById(id)
			        .orElseThrow(() -> new RuntimeException("User not found: " + id));
	}

}
