package com.pedro.finances_manager.controller;

import com.pedro.finances_manager.dto.transfers.TransferRequestDTO;
import com.pedro.finances_manager.security.JWTUserData;
import com.pedro.finances_manager.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/transfer")
public class TransferController {

    @Autowired
    private final TransferService transferService;


    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping("/users")
    public ResponseEntity<BigDecimal> getAccount(@RequestBody TransferRequestDTO requestDTO, @AuthenticationPrincipal JWTUserData jwUser) {
        // Service return account.id = transaction.account.id
        transferService.transfer(requestDTO, jwUser);
       return ResponseEntity.ok().build();
    }

}
