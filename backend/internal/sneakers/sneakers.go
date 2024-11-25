package sneakers

import (
	"context"
)

type Sneaker struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageUrl    string  `json:"imageUrl"`
}

type CreateSneakerReq struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageUrl    string  `json:"imageUrl"`
}

type Repository interface {
	GetSneakerByID(ctx context.Context, ID int64) (*Sneaker, error)
	GetAllSneakers(ctx context.Context) ([]*Sneaker, error)
	AddSneaker(ctx context.Context, sneaker *Sneaker) (*Sneaker, error)
	DeleteSneaker(ctx context.Context, ID int64) error
}

type Service interface {
	AddSneaker(ctx context.Context, req *CreateSneakerReq) (*Sneaker, error)
	GetAllSneakers(ctx context.Context) ([]*Sneaker, error)
	DeleteSneaker(ctx context.Context, ID int64) error
}
