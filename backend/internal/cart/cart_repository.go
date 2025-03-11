package cart

import "database/sql"

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) AddToCart(userSSOID, sneakerID, quantity int) error {
	var exists bool
	err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM cart WHERE user_sso_id=$1 AND sneaker_id=$2)",
		userSSOID, sneakerID).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		_, err = r.db.Exec("UPDATE cart SET quantity = quantity + 1 WHERE user_sso_id=$1 AND sneaker_id=$2",
			userSSOID, sneakerID)
	} else {
		_, err = r.db.Exec("INSERT INTO cart (user_sso_id, sneaker_id, quantity) VALUES ($1, $2, 1)",
			userSSOID, sneakerID)
	}
	return err
}

func (r *Repository) UpdateCartItemQuantityByID(userSSOID, cartItemID, quantity int) error {
	if quantity <= 0 {
		return r.DeleteFromCartByID(userSSOID, cartItemID)
	}

	// Проверяем, что запись принадлежит пользователю
	var count int
	err := r.db.QueryRow("SELECT COUNT(*) FROM cart WHERE id=$1 AND user_sso_id=$2",
		cartItemID, userSSOID).Scan(&count)
	if err != nil {
		return err
	}
	if count == 0 {
		return sql.ErrNoRows
	}

	_, err = r.db.Exec("UPDATE cart SET quantity = $1 WHERE id=$2 AND user_sso_id=$3",
		quantity, cartItemID, userSSOID)
	return err
}

func (r *Repository) DeleteFromCartByID(userSSOID, cartItemID int) error {
	// Проверяем, что запись принадлежит пользователю
	var count int
	err := r.db.QueryRow("SELECT COUNT(*) FROM cart WHERE id=$1 AND user_sso_id=$2",
		cartItemID, userSSOID).Scan(&count)
	if err != nil {
		return err
	}
	if count == 0 {
		return sql.ErrNoRows
	}

	_, err = r.db.Exec("DELETE FROM cart WHERE id=$1 AND user_sso_id=$2", cartItemID, userSSOID)
	return err
}

func (r *Repository) GetAllCart(userSSOID int) ([]Cart, error) {
	rows, err := r.db.Query("SELECT id, user_sso_id, sneaker_id, quantity FROM cart WHERE user_sso_id=$1", userSSOID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var carts []Cart
	for rows.Next() {
		var c Cart
		if err := rows.Scan(&c.ID, &c.UserSSOID, &c.SneakerID, &c.Quantity); err != nil {
			return nil, err
		}
		carts = append(carts, c)
	}

	return carts, nil
}

func (r *Repository) IsInCart(userSSOID, sneakerID int) (bool, error) {
	var exists bool
	err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM cart WHERE user_sso_id=$1 AND sneaker_id=$2)",
		userSSOID, sneakerID).Scan(&exists)
	return exists, err
}
