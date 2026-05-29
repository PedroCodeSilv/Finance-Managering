package com.pedro.finances_manager.dto.transaction.project;

import com.pedro.finances_manager.entities.Category;

public record AccountCategoryLink(Long accountId, Category category) {
}
