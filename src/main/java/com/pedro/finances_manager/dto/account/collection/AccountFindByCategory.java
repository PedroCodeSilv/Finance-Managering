package com.pedro.finances_manager.dto.account.collection;


import com.pedro.finances_manager.entities.Category;
import com.pedro.finances_manager.entities.enums.AccountCurrency;
import com.pedro.finances_manager.entities.enums.AccountType;

import java.util.List;
import java.math.BigDecimal;

public record AccountFindByCategory(
        Long accountId,
        String accountName,
        AccountCurrency currency,
        AccountType type,
        List<Category> listCategory,
        BigDecimal amountTotal
) {}
