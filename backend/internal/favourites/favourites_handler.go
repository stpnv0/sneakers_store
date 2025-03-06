package favourites

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{repo: repo}
}

// AddFavorite добавляет кроссовку в избранное
func (h *Handler) AddFavorite(c *gin.Context) {
	userSSOID, exists := c.Get("user_sso_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req struct {
		SneakerID int `json:"sneaker_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Проверяем, не добавлен ли уже этот товар в избранное
	exists, err := h.repo.IsFavorite(userSSOID.(int), req.SneakerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check favorite status"})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Already in favorites"})
		return
	}

	if err := h.repo.AddFavourite(userSSOID.(int), req.SneakerID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add favorite"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Added to favorites"})
}

// RemoveFavorite удаляет кроссовку из избранного
func (h *Handler) RemoveFavorite(c *gin.Context) {
	userSSOID, exists := c.Get("user_sso_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	sneakerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sneaker ID"})
		return
	}

	if err := h.repo.DeleteFavorite(userSSOID.(int), sneakerID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove favorite"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Removed from favorites"})
}

// GetFavorites возвращает список избранных кроссовок пользователя
func (h *Handler) GetFavorites(c *gin.Context) {
	userSSOID, exists := c.Get("user_sso_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	favorites, err := h.repo.GetAllFavourites(userSSOID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get favorites"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"favorites": favorites})
}
