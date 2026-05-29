package com.pedro.finances_manager.dto.request;

import java.math.BigDecimal;


public record TransactionRequestDTO(
	
		BigDecimal amount,
		String description,
		Long accountId,
		Long categoryId
		) {
	

}
