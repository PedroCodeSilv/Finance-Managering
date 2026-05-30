package com.pedro.finances_manager.dto.category.response;

import com.pedro.finances_manager.entities.enums.CategoryType;

public record CategoryResponseDTO(Long id, String name, CategoryType type) {


}
