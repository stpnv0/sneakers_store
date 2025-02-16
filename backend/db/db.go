package db

import (
	"database/sql"
	"fmt"
	"log"
	"sneakers-store/internal/config"

	_ "github.com/lib/pq" // PostgreSQL драйвер
)

// NewDatabase создает и возвращает подключение к базе данных
func ConnectDB(cfg *config.Config) (*sql.DB, error) {

	connStr := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Name,
		cfg.Database.SSLMode,
	)
	// Строка подключения к базе данных
	// connStr := "postgresql://root:password@localhost:5432/sneaker?sslmode=disable"

	// Открытие подключения
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Проверка подключения
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("✅ Успешное подключение к БД")
	return db, nil
}
