CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    user_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_companies_user_id ON companies(user_id);

-- Add optional company_id to accounts
ALTER TABLE accounts ADD COLUMN company_id BIGINT REFERENCES companies(id);
CREATE INDEX idx_accounts_company_id ON accounts(company_id);
