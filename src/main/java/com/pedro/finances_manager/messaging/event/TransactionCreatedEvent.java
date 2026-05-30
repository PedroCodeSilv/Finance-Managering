package com.pedro.finances_manager.messaging.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionCreatedEvent(
        Long transactionId,
        Long userId,
        Long accountId,
        Long categoryId,
        String categoryName,
        String categoryType,
        BigDecimal amount,
        String description,
        LocalDateTime transactionDate
) {
}
