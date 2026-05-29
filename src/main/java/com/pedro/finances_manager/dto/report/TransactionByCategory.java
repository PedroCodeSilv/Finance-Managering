package com.pedro.finances_manager.dto.report;

import com.pedro.finances_manager.entities.enums.CategoryType;

import java.math.BigDecimal;

/*
* get transaction by category
* */
public record TransactionByCategory(

String categoryName,
CategoryType type,
BigDecimal amount

) {
}
