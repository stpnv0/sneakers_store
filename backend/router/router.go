package router

import (
	"sneakers-store/internal/sneakers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(sneakerHandler *sneakers.Handler) {
	r = gin.Default()

	// CORS настройки
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:5173"
		},
		MaxAge: 12 * time.Hour,
	}))

	// Настройка маршрутов
	r.POST("/api/v1/sneakers", sneakerHandler.AddSneaker)           // Добавить кроссовки
	r.GET("/api/v1/sneakers", sneakerHandler.GetAllSneakers)        // Получить список кроссовок
	r.DELETE("//api/v1/sneakers/:id", sneakerHandler.DeleteSneaker) // Удалить кроссовок
}

func Start(addr string) error {
	return r.Run(addr)
}
