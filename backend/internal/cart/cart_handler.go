package cart

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

func (h *Handler) AddToCart(c *gin.Context) {
	userSSOID, exists := c.Get("user_sso_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req struct {
		SneakerID int `json:"sneaker_id" binding:"required"`
		Quantity  int `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.AddToCart(userSSOID.(int), req.SneakerID, req.Quantity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add in cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Added to cart"})
}

func (h *Handler) UpdateCartItemQuantity(c *gin.Context) {
	userSSOID, exists := c.Get("user_sso_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	cartItemID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart item ID"})
		return
	}

	var req struct {
		Quantity int `json:"quantity" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.UpdateCartItemQuantityByID(userSSOID.(int), cartItemID, req.Quantity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item quantity"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart item quantity updated"})
}

func (h *Handler) DeleteFromCart(c *gin.Context) {
	userSSOID, exists := c.Get("user_sso_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	cartItemID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart item ID"})
		return
	}

	if err := h.repo.DeleteFromCartByID(userSSOID.(int), cartItemID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete from cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted from cart"})
}

func (h *Handler) GetAllCart(c *gin.Context) {
	userSSOID, exists := c.Get("user_sso_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	cart, err := h.repo.GetAllCart(userSSOID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get Cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"cart": cart})
}
