package com.pedro.finances_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedro.finances_manager.dto.company.request.CompanyRequestDTO;
import com.pedro.finances_manager.dto.company.response.CompanyResponseDTO;
import com.pedro.finances_manager.entities.Company;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.CompanyRepository;
import com.pedro.finances_manager.repository.UserRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public CompanyResponseDTO create(CompanyRequestDTO req, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Company company = new Company(req.name(), req.cnpj(), user);
        companyRepository.save(company);
        return CompanyResponseDTO.from(company);
    }

    public List<CompanyResponseDTO> findAllByUser(Long userId) {
        return companyRepository.findByUserId(userId).stream()
                .map(CompanyResponseDTO::from)
                .toList();
    }
}
