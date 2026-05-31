package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.report.AccountBalance;
import com.pedro.finances_manager.dto.report.MonthlyBalance;
import com.pedro.finances_manager.dto.report.TransactionByCategory;
import com.pedro.finances_manager.dto.transaction.response.TransactionResponseDTO;
import com.pedro.finances_manager.security.JWTUserData;
import com.pedro.finances_manager.service.ReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {

	private final ReportService reportService;

	public ReportController(ReportService reportService) {
		this.reportService = reportService;
	}

	@GetMapping("/monthly-balance")
	public List<MonthlyBalance> monthlyBalance(@AuthenticationPrincipal JWTUserData user) {
		return reportService.getMonthlyBalance(user.userId());
	}

	@GetMapping("/by-category")
	public List<TransactionByCategory> byCategory(@AuthenticationPrincipal JWTUserData user) {
		return reportService.getTransactionsByCategory(user.userId());
	}

	@GetMapping("/category/{categoryId}/transactions")
	public List<TransactionResponseDTO> transactionsByCategory(
			@AuthenticationPrincipal JWTUserData user,
			@PathVariable Long categoryId) {
		return reportService.getTransactionsByCategoryId(user.userId(), categoryId);
	}

	@GetMapping("/account-balances")
	public List<AccountBalance> accountBalances(@AuthenticationPrincipal JWTUserData user) {
		return reportService.getAccountBalances(user.userId());
	}

	@GetMapping("/company/{companyId}/balances")
	public List<AccountBalance> companyBalances(
			@AuthenticationPrincipal JWTUserData user,
			@PathVariable Long companyId) {
		return reportService.getAccountBalancesByCompany(user.userId(), companyId);
	}

	@GetMapping("/company/{companyId}/monthly-balance")
	public List<MonthlyBalance> companyMonthlyBalance(
			@AuthenticationPrincipal JWTUserData user,
			@PathVariable Long companyId) {
		return reportService.getMonthlyBalanceByCompany(user.userId(), companyId);
	}

	@GetMapping("/company/{companyId}/by-category")
	public List<TransactionByCategory> companyByCategory(
			@AuthenticationPrincipal JWTUserData user,
			@PathVariable Long companyId) {
		return reportService.getTransactionsByCategoryByCompany(user.userId(), companyId);
	}

	@GetMapping("/account/{accountId}/transactions")
	public List<TransactionResponseDTO> transactionsByAccount(
			@AuthenticationPrincipal JWTUserData user,
			@PathVariable Long accountId,
			@RequestParam(required = false) java.time.LocalDate startDate,
			@RequestParam(required = false) java.time.LocalDate endDate) {
		return reportService.getTransactionsByAccountId(user.userId(), accountId, startDate, endDate);
	}
}
