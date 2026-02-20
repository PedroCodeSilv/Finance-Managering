package com.pedro.finances_manager.dto.request;



import com.pedro.finances_manager.entities.enums.AccountCurrency;
import com.pedro.finances_manager.entities.enums.AccountType;


import jakarta.validation.constraints.NotBlank;

public record AccountRequestDTO(@NotBlank String name, @NotBlank AccountType type, @NotBlank AccountCurrency currency  ) {

}
