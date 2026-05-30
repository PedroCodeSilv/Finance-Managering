package com.pedro.finances_manager.dto.transaction.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pedro.finances_manager.entities.Transaction;
import com.pedro.finances_manager.entities.enums.CategoryType;

public record TransactionResponseDTO(
		Long id,
		BigDecimal amount,
		String description,
		LocalDateTime transactionDate,
		CategoryType categoryType
		
		) {
	public static TransactionResponseDTO from(Transaction t) {
		return new TransactionResponseDTO(t.getId(), t.getAmount(), t.getDescription(), t.getTransactionDate(), t.getCategory().getType());
	}

}
