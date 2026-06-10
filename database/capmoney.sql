CREATE TABLE users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(30),
    type VARCHAR(20),

    CONSTRAINT fk_category_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE budgets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    CONSTRAINT fk_budget_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_budget_category
    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,

    transaction_type VARCHAR(20)
    CHECK (transaction_type IN ('income','expense')),

    description TEXT,
    transaction_date TIMESTAMP NOT NULL,

    CONSTRAINT fk_transaction_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_transaction_category
    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

CREATE TABLE transaction_images (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_image
    FOREIGN KEY(transaction_id)
    REFERENCES transactions(id)
    ON DELETE CASCADE
);
