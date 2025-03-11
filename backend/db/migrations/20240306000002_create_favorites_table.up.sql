CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_sso_id INTEGER NOT NULL,
    sneaker_id INTEGER NOT NULL REFERENCES sneakers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_sso_id, sneaker_id)
);

-- Добавляем комментарии к полям для лучшей документации
COMMENT ON TABLE favorites IS 'Таблица избранных товаров пользователей';
COMMENT ON COLUMN favorites.user_sso_id IS 'ID пользователя из системы SSO';
COMMENT ON COLUMN favorites.sneaker_id IS 'ID кроссовка из таблицы sneakers';

-- Создаем индекс для быстрого поиска избранных товаров пользователя, если он не существует
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_favorites_user_sso_id') THEN
        CREATE INDEX idx_favorites_user_sso_id ON favorites(user_sso_id);
    END IF;
END $$;