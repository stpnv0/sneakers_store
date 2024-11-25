package sneakers

import (
	"context"
	"time"
)

type service struct {
	Repository
	timeout time.Duration
}

func NewService(repository Repository) Service {
	return &service{
		repository,
		time.Duration(2) * time.Second,
	}
}

func (s *service) AddSneaker(c context.Context, req *CreateSneakerReq) (*Sneaker, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	sn := &Sneaker{
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		ImageUrl:    req.ImageUrl,
	}

	r, err := s.Repository.AddSneaker(ctx, sn)
	if err != nil {
		return nil, err
	}
	res := &Sneaker{
		ID:          r.ID,
		Title:       r.Title,
		Description: r.Description,
		Price:       r.Price,
		ImageUrl:    r.ImageUrl,
	}

	return res, nil
}

func (s *service) DeleteSneaker(c context.Context, id int64) error {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	return s.Repository.DeleteSneaker(ctx, id)
}

func (s *service) GetAllSneakers(c context.Context) ([]*Sneaker, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	return s.Repository.GetAllSneakers(ctx)
}
