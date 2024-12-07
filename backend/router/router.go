package router

import (
	"log"
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
		MaxAge:           12 * time.Hour,
	}))

	// Настройка маршрутов
	api := r.Group("/api/v1")
	{
		// Настройка маршрутов
		itemsGroup := api.Group("/items")
		{
			itemsGroup.POST("", sneakerHandler.AddSneaker)          // Добавить кроссовки
			itemsGroup.GET("", sneakerHandler.GetAllSneakers)       // Получить список кроссовок
			itemsGroup.DELETE("/:id", sneakerHandler.DeleteSneaker) // Удалить кроссовок
		}

		// заглушки для корзины
		cartGroup := api.Group("/cart")
		{
			cartGroup.GET("", func(ctx *gin.Context) {
				log.Println("GET /cart called")
				ctx.JSON(200, gin.H{"message": "GET /cart not implemented yet"})
			})
			cartGroup.POST("", func(ctx *gin.Context) {
				log.Println("POST /cart called")
				ctx.JSON(200, gin.H{"message": "POST /cart not implemented yet"})
			})
			cartGroup.DELETE("/:id", func(ctx *gin.Context) {
				log.Println("DELETE /cart/:id called")
				ctx.JSON(200, gin.H{"message": "DELETE /cart not implemented yet"})
			})
		}

	}

}

func Start(addr string) error {
	return r.Run(addr)
}
