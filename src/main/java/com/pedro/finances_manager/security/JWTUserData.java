package com.pedro.finances_manager.security;


public record JWTUserData(Long userId, String email, String role) {}
