package favourites

import (
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) AddFavourite(userSSOID, sneakerID int) error {
	_, err := r.db.Exec("INSERT INTO favorites (user_sso_id, sneaker_id) VALUES ($1, $2)", userSSOID, sneakerID)
	return err
}

func (r *Repository) DeleteFavorite(userSSOID, sneakerID int) error {
	_, err := r.db.Exec("DELETE FROM favorites WHERE user_sso_id=$1 AND sneaker_id=$2", userSSOID, sneakerID)
	return err
}

func (r *Repository) GetAllFavourites(userSSOID int) ([]Favourite, error) {
	rows, err := r.db.Query(`
		SELECT id, user_sso_id, sneaker_id, created_at 
		FROM favorites 
		WHERE user_sso_id=$1
		ORDER BY created_at DESC`, userSSOID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var favourites []Favourite
	for rows.Next() {
		var f Favourite
		if err := rows.Scan(&f.ID, &f.UserSSOID, &f.SneakerID, &f.CreatedAt); err != nil {
			return nil, err
		}
		favourites = append(favourites, f)
	}

	return favourites, nil
}

// Добавляем метод для проверки существования записи
func (r *Repository) IsFavorite(userSSOID, sneakerID int) (bool, error) {
	var exists bool
	err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM favorites WHERE user_sso_id=$1 AND sneaker_id=$2)",
		userSSOID, sneakerID).Scan(&exists)
	return exists, err
}
