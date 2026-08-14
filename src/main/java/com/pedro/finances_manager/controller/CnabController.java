package com.pedro.finances_manager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Stub inicial. Com pasta + WatchService, o upload HTTP fica opcional depois.
 */
@RestController
@RequestMapping("/cnab")
public class CnabController {

	@PostMapping("/upload")
	public ResponseEntity<String> uploadStub() {
		return ResponseEntity.ok("CNAB upload ainda não implementado. Use a pasta data/cnab/inbound com WatchService.");
	}
}
