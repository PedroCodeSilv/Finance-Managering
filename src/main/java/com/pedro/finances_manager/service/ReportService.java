package com.pedro.finances_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.report.AccountBalance;
import com.pedro.finances_manager.dto.report.MonthlyBalance;
import com.pedro.finances_manager.dto.report.TransactionByCategory;
import com.pedro.finances_manager.dto.transaction.response.TransactionResponseDTO;
import com.pedro.finances_manager.repository.TransactionRepository;

@Service
public class ReportService {

	private final TransactionRepository transactionRepository;

	public ReportService(TransactionRepository transactionRepository) {
		this.transactionRepository = transactionRepository;
	}

	public List<MonthlyBalance> getMonthlyBalance(Long userId) {
		return transactionRepository.findMonthlyBalanceByUser(userId);
	}

	public List<TransactionByCategory> getTransactionsByCategory(Long userId) {
		return transactionRepository.listAllTransactionByCategoryByUser(userId);
	}

	public List<TransactionResponseDTO> getTransactionsByCategoryId(Long userId, Long categoryId) {
		return transactionRepository.findByUserIdAndCategoryId(userId, categoryId)
				.stream()
				.map(TransactionResponseDTO::from)
				.toList();
	}

	public List<TransactionResponseDTO> getTransactionsByAccountId(Long userId, Long accountId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
		java.time.LocalDateTime start = startDate != null ? startDate.atStartOfDay() : java.time.LocalDateTime.of(2000, 1, 1, 0, 0);
		java.time.LocalDateTime end = endDate != null ? endDate.atTime(23, 59, 59) : java.time.LocalDateTime.of(2100, 12, 31, 23, 59, 59);
		return transactionRepository.findByUserIdAndAccountIdAndDateRange(userId, accountId, start, end)
				.stream()
				.map(TransactionResponseDTO::from)
				.toList();
	}

	public List<AccountBalance> getAccountBalances(Long userId) {
		return transactionRepository.findAccountBalancesByUser(userId);
	}

	public List<AccountBalance> getAccountBalancesByCompany(Long userId, Long companyId) {
		return transactionRepository.findAccountBalancesByCompany(userId, companyId);
	}

	public List<MonthlyBalance> getMonthlyBalanceByCompany(Long userId, Long companyId) {
		return transactionRepository.findMonthlyBalanceByCompany(userId, companyId);
	}

	public List<TransactionByCategory> getTransactionsByCategoryByCompany(Long userId, Long companyId) {
		return transactionRepository.listTransactionByCategoryByCompany(userId, companyId);
	}
}
