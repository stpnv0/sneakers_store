package main

import (
	"log/slog"
	"os"
	"sneakers-store/db"
	"sneakers-store/internal/config"
	"sneakers-store/internal/logger/handlers/slogpretty"
	"sneakers-store/internal/sneakers"
	"sneakers-store/router"
)

func main() {
	cfg := config.MustLoad()

	log := setupPrettySlog()
	log.Info("starting url-shortener", slog.String("env", cfg.Env))
	log.Debug("debug messages are enabled")

	database, err := db.ConnectDB(cfg)
	if err != nil {
		log.Info("[ERROR] can't connect to database: %s", err)
	}
	defer database.Close()

	//Инициализация слоев
	repo := sneakers.NewRepository(database)       // Репозиторий
	service := sneakers.NewService(repo)           // Сервис
	sneakerHandler := sneakers.NewHandler(service) // Хендлер

	// Настройка роутера и запуск сервера
	router.InitRouter(sneakerHandler)
	if err := router.Start("0.0.0.0:8080"); err != nil {
		log.Info("[ERROR] failed to start server: %s", err)
	}
}

func setupPrettySlog() *slog.Logger {
	opts := slogpretty.PrettyHandlerOptions{
		SlogOpts: &slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}

	handler := opts.NewPrettyHandler(os.Stdout)

	return slog.New(handler)
}
