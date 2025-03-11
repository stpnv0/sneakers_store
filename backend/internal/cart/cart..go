package cart

type Cart struct {
	ID        int `json:"id"`
	UserSSOID int `json:"user_sso_id"`
	SneakerID int `json:"sneaker_id"`
	Quantity  int `json:"quantity"`
}
