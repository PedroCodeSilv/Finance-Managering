package com.pedro.finances_manager.dto.company.response;

import com.pedro.finances_manager.entities.Company;

public record CompanyResponseDTO(
        Long id,
        String name,
        String cnpj
) {
    public static CompanyResponseDTO from(Company c) {
        return new CompanyResponseDTO(c.getId(), c.getName(), c.getCnpj());
    }
}
