package com.pedro.finances_manager.dto.response;

import com.pedro.finances_manager.entities.Category;
import com.pedro.finances_manager.entities.enums.CategoryType;

public record CategoryResponseDTO(String name, CategoryType type) {


}
