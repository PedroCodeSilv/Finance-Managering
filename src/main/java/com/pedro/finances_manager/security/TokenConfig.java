package com.pedro.finances_manager.security;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.pedro.finances_manager.entities.User;

import com.pedro.finances_manager.security.JWTUserData;


@Component
public class TokenConfig {
	
	
	private String secret = "secret";
	
	
	public String generetionToken(User user) {
		Algorithm algorithm = Algorithm.HMAC256(secret);
		
		return JWT.create()
				.withClaim("userId", user.getId())
				.withClaim("role", "USER")
				.withSubject(user.getEmail())
				.withExpiresAt(Instant.now().plusSeconds(1800))
				.withIssuedAt(Instant.now())
				.sign(algorithm);
		
	}
	
	public Optional<JWTUserData> validateToken(String token){
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			DecodedJWT decoder = JWT.require(algorithm)
					.build().verify(token);
			return Optional.of(new JWTUserData(
					decoder.getClaim("userId").asLong(),
					decoder.getSubject(),
					decoder.getClaim("role").asString()
					));
			
		} catch (JWTVerificationException e) {
			return Optional.empty();
		}
		
		
	}
}
