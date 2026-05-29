package com.pedro.finances_manager.dto.user.request;

import jakarta.validation.constraints.NotBlank;

public record UserRequestDTO( @NotBlank String name, @NotBlank String password, @NotBlank String email) {}
	

