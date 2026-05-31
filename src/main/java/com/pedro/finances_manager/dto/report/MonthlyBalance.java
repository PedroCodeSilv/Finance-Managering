package com.pedro.finances_manager.dto.report;

import java.math.BigDecimal;

public record MonthlyBalance(
		int year,
		int month,
		BigDecimal totalIncome,
		BigDecimal totalExpense,
		BigDecimal balance
) {
	public MonthlyBalance(int year, int month, BigDecimal totalIncome, BigDecimal totalExpense) {
		this(year, month, totalIncome, totalExpense, totalIncome.subtract(totalExpense));
	}
}
