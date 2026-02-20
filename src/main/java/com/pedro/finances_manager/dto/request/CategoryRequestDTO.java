package com.pedro.finances_manager.dto.request;

import com.pedro.finances_manager.entities.enums.CategoryType;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(@NotBlank String name, @NotBlank CategoryType type) {

}
