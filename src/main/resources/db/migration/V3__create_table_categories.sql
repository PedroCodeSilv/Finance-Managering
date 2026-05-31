CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    create_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
