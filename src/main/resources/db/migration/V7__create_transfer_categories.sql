INSERT INTO categories (name, type, user_id)
SELECT
    'Recebimento',
    'INCOME',
    u.id
FROM users u
WHERE NOT EXISTS (
    SELECT 1
    FROM categories c
    WHERE c.user_id = u.id
      AND c.name = 'Recebimento'
);

INSERT INTO categories (name, type, user_id)
SELECT
    'Deposito',
    'EXPENSE',
    u.id
FROM users u
WHERE NOT EXISTS (
    SELECT 1
    FROM categories c
    WHERE c.user_id = u.id
      AND c.name = 'Deposito'
);