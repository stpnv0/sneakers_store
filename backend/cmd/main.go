package main

import (
	"log"
	"sneakers-store/db"
	"sneakers-store/internal/sneakers"
	"sneakers-store/router"
)

func main() {
	// Подключение к базе данных
	database, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("[ERROR] can't connect to database: %s", err)
	}

	// Инициализация слоев
	repo := sneakers.NewRepository(database)       // Репозиторий
	service := sneakers.NewService(repo)           // Сервис
	sneakerHandler := sneakers.NewHandler(service) // Хендлер

	// Настройка роутера и запуск сервера
	router.InitRouter(sneakerHandler)
	if err := router.Start("0.0.0.0:8080"); err != nil {
		log.Fatalf("[ERROR] failed to start server: %s", err)
	}
}
