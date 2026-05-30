package com.pedro.finances_manager.dto.account.response;

import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.entities.enums.AccountCurrency;
import com.pedro.finances_manager.entities.enums.AccountType;

public record AccountResponseDTO(Long id, String name, AccountType type, AccountCurrency currency) {
	
	public static AccountResponseDTO from(Account a) {
		return new AccountResponseDTO(a.getId(), a.getName(), a.getType(), a.getCurrency());
	}

}
