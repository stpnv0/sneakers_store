CREATE TABLE "users" (
    "id"        SERIAL PRIMARY KEY,
    "username"  VARCHAR(255) NOT NULL,
    "gmail"     VARCHAR(255) NOT NULL,
    "password"  VARCHAR(255) NOT NULL
)