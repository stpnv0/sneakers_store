package router

import (
	"sneakers-store/internal/auth"
	"sneakers-store/internal/sneakers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(sneakerHandler *sneakers.Handler, authHandler *auth.Handler) {
	r = gin.Default()

	// CORS настройки
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Настройка маршрутов
	api := r.Group("/api/v1")
	{
		// Аутентификация
		authGroup := api.Group("/auth")
		{
			authGroup.POST("/login", func(c *gin.Context) {
				authHandler.Login(c.Writer, c.Request)
			})
			authGroup.POST("/register", func(c *gin.Context) {
				authHandler.Register(c.Writer, c.Request)
			})
		}

		// Товары
		itemsGroup := api.Group("/items")
		{
			itemsGroup.POST("", sneakerHandler.AddSneaker)
			itemsGroup.GET("", sneakerHandler.GetAllSneakers)
			itemsGroup.DELETE("/:id", sneakerHandler.DeleteSneaker)
		}

		// Корзина
		cartGroup := api.Group("/cart")
		{
			cartGroup.GET("", func(ctx *gin.Context) {
				ctx.JSON(200, gin.H{"message": "GET /cart not implemented yet"})
			})
			cartGroup.POST("", func(ctx *gin.Context) {
				ctx.JSON(200, gin.H{"message": "POST /cart not implemented yet"})
			})
			cartGroup.DELETE("/:id", func(ctx *gin.Context) {
				ctx.JSON(200, gin.H{"message": "DELETE /cart not implemented yet"})
			})
		}
	}
}

func Start(addr string) error {
	return r.Run(addr)
}
