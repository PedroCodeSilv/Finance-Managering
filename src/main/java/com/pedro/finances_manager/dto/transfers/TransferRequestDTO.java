package com.pedro.finances_manager.dto.transfers;

import com.pedro.finances_manager.entities.Account;

import java.math.BigDecimal;

public record TransferRequestDTO (
        Long sourceAccountId,
        Long destinationAccountId,
        BigDecimal amount
) {
}
