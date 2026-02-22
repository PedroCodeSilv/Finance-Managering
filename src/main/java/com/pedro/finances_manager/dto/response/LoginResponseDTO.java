package com.pedro.finances_manager.dto.response;

import com.pedro.finances_manager.entities.User;

public record LoginResponseDTO(String name, String email) {
	
	public static LoginResponseDTO loginAuth(User user) {
		return new LoginResponseDTO(user.getName(), user.getEmail());
	}

}
