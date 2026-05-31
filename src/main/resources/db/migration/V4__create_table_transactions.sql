CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    amount NUMERIC(19, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP NOT NULL DEFAULT now(),
    user_id BIGINT NOT NULL REFERENCES users(id),
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    category_id BIGINT NOT NULL REFERENCES categories(id)
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
