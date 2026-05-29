package com.pedro.finances_manager.dto.report;

public record IdentifyIdFinances(
        Long accountId,
        Long categoryId,
        Long transactionId
) {
}
