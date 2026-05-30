CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    create_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
