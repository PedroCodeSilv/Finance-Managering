package com.pedro.finances_manager.dto.auth.response;



public record LoginResponseDTO(String token) {
	
	public static LoginResponseDTO loginAuth(String token) {
		return new LoginResponseDTO(token);
	}

}
