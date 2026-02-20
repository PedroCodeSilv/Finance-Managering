package com.pedro.finances_manager.dto.response;

import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.entities.enums.AccountCurrency;
import com.pedro.finances_manager.entities.enums.AccountType;

public record AccountResponseDTO(String name, AccountType type, AccountCurrency currency) {
	
	public static AccountResponseDTO from(Account a) {
		return new AccountResponseDTO(a.getName(), a.getType(), a.getCurrency());
	}

}
