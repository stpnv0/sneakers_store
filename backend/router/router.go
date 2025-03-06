package router

import (
	"sneakers-store/internal/auth"
	"sneakers-store/internal/favourites"
	"sneakers-store/internal/sneakers"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

// AuthMiddleware проверяет JWT токен
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Проверяем формат "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(401, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		token := parts[1]
		// TODO: Добавить проверку токена через SSO сервис

		// Временно просто проверяем наличие токена
		if token == "" {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Сохраняем ID пользователя в контексте
		c.Set("user_sso_id", 1) // TODO: Получать реальный ID из токена
		c.Next()
	}
}

func InitRouter(sneakerHandler *sneakers.Handler, authHandler *auth.Handler, favHandler *favourites.Handler) {
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

		// Избранное (с middleware аутентификации)
		favGroup := api.Group("/favorites")
		favGroup.Use(AuthMiddleware()) // Добавляем middleware
		{
			favGroup.POST("", favHandler.AddFavorite)
			favGroup.GET("", favHandler.GetFavorites)
			favGroup.DELETE("/:id", favHandler.RemoveFavorite)
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
