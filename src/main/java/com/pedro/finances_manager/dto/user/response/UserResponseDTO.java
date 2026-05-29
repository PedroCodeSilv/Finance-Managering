package com.pedro.finances_manager.dto.response;

import com.pedro.finances_manager.entities.User;

public record UserResponseDTO(String name,  String email) {
	
	public static UserResponseDTO from(User user) {
		
		return new UserResponseDTO(
				user.getName(),
				user.getEmail()
				);
		
	}

}
