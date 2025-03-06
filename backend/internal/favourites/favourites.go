package favourites

import "time"

type Favourite struct {
	ID        int       `json:"id"`
	UserSSOID int       `json:"user_sso_id"`
	SneakerID int       `json:"sneaker_id"`
	CreatedAt time.Time `json:"created_at"`
}
