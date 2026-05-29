package com.pedro.finances_manager.dto.auth.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(@NotBlank String email, @NotBlank String password) {

}
