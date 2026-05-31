package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.company.request.CompanyRequestDTO;
import com.pedro.finances_manager.dto.company.response.CompanyResponseDTO;
import com.pedro.finances_manager.security.JWTUserData;
import com.pedro.finances_manager.service.CompanyService;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public CompanyResponseDTO create(@RequestBody CompanyRequestDTO req,
                                     @AuthenticationPrincipal JWTUserData user) {
        return companyService.create(req, user.userId());
    }

    @GetMapping
    public List<CompanyResponseDTO> findAll(@AuthenticationPrincipal JWTUserData user) {
        return companyService.findAllByUser(user.userId());
    }
}
