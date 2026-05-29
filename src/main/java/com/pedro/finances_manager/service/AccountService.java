package com.pedro.finances_manager.service;

import com.pedro.finances_manager.dto.account.collection.AccountFindByCategory;
import com.pedro.finances_manager.dto.report.IdentifyIdFinances;
import com.pedro.finances_manager.dto.transaction.project.AccountCategoryLink;
import com.pedro.finances_manager.entities.Category;
import com.pedro.finances_manager.repository.CategoryRepository;
import com.pedro.finances_manager.repository.TransactionRepository;
import com.pedro.finances_manager.security.JWTUserData;

import java.util.Map;
import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.account.request.AccountRequestDTO;
import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.AccountRepository;
import com.pedro.finances_manager.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

	private final AccountRepository accountRepository;
	private final UserRepository userRepository;
	private final CategoryRepository categoryRepository;
	private final TransactionRepository transactionRepository;
	private Collectors Collectors;


	public AccountService(AccountRepository accountRepository,
                          UserRepository userRepository,
                          CategoryRepository categoryRepository,
						  TransactionRepository transactionRepository
    ) {

		this.accountRepository = accountRepository;
		this.userRepository = userRepository;
		this.categoryRepository = categoryRepository;

        this.transactionRepository = transactionRepository;
    }

	public Account create(AccountRequestDTO req, JWTUserData user) {
		User userData = findUserForAccount(user.userId());
		Account account = new Account(
				req.name(),
				req.type(),
				req.currency(),
				userData
				
				);
				
		return accountRepository.save(account);
	}


	public User findUserForAccount(Long id) {
		  return userRepository.findById(id)
			        .orElseThrow(() -> new RuntimeException("User not found: " + id));
	}

	public List<AccountFindByCategory> createListAccountReport(Long userId){

		/*
		* Transaction is the entity that find account and category
		* it's know the key to link account and category,
		* */
		//Create list de ids Account, Category, Transaction
		List<IdentifyIdFinances> list = transactionRepository.identifyIdFinance(userId);

		//Only get ids accounts
		List<Long> listAccountIds = list.stream().map(x -> x.accountId()).toList();

		//Get list Category by Accounts ids, from Transaction
		List<Category> listCategory = categoryRepository.findCategoryByAccountId(listAccountIds, userId);

		//get amounts and list null
		List<AccountFindByCategory> listReport = accountRepository.reportByCategory(listAccountIds, userId);

		//Create list DTO to find Account by Category, the command linked a id to category
		List<AccountCategoryLink> listAccountCategoryLink = transactionRepository.accountCategoryLink(listAccountIds, userId);

		//Get category by account
		/*
		* GroupBy is method in Collectors interface a method to include Long in map and List<Category>
		*
		*
		* */
		Map<Long, List<Category>> mapAccountsIdByListCategory = listAccountCategoryLink
                .stream()
                .collect(Collectors.groupingBy(
                        AccountCategoryLink::accountId,
                        Collectors.mapping(AccountCategoryLink::category, Collectors.toList())

                ));

		//create a return for method. with new List

		List<AccountFindByCategory> result = listReport.stream().map(report ->
					new AccountFindByCategory(
							report.accountId(),
							report.accountName(),
							report.currency(),
							report.type(),
							mapAccountsIdByListCategory.getOrDefault(report.accountId(), List.of()),
							report.amountTotal()
					)

				).toList();

		System.out.println(result);

		return result;
	}



}
