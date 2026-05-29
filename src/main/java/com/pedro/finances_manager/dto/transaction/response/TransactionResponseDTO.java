package com.pedro.finances_manager.dto.response;

import java.math.BigDecimal;

import com.pedro.finances_manager.entities.Transaction;

public record TransactionResponseDTO(
		Long id,
		BigDecimal amount,
		String description
		
		) {
	public static TransactionResponseDTO from(Transaction t) {
		return new TransactionResponseDTO(t.getId(), t.getAmount(), t.getDescription());
	}

}
