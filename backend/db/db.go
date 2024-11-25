package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq" // PostgreSQL драйвер
)

// NewDatabase создает и возвращает подключение к базе данных
func NewDatabase() (*sql.DB, error) {
	// Строка подключения к базе данных
	connStr := "postgresql://root:password@localhost:5432/sneaker?sslmode=disable"

	// Открытие подключения
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Проверка подключения
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}
