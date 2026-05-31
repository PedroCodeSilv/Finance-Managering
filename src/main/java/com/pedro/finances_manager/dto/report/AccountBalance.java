package com.pedro.finances_manager.dto.report;

import com.pedro.finances_manager.entities.enums.AccountCurrency;
import com.pedro.finances_manager.entities.enums.AccountType;

import java.math.BigDecimal;

public record AccountBalance(
        Long accountId,
        String accountName,
        AccountType type,
        AccountCurrency currency,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance
) {
    public AccountBalance(Long accountId, String accountName, AccountType type, AccountCurrency currency, BigDecimal totalIncome, BigDecimal totalExpense) {
        this(accountId, accountName, type, currency, totalIncome, totalExpense, totalIncome.subtract(totalExpense));
    }
}
