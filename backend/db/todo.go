package db

import (
	"database/sql"
	"fmt"
	"time"

	"personalapp/models"
)

func CreateTodo(database *sql.DB, todo models.DailyTodo) (string, error) {
	tx, err := database.Begin()
	if err != nil {
		return "", fmt.Errorf("begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Delete the existing todo/day if it exists.
	if err := deleteExistingTodo(tx, todo.Date); err != nil {
		return "", err
	}

	// Create the todo/day.
	var todoID string
	err = tx.QueryRow(`
		INSERT INTO todo (date, title, description)
		VALUES ($1, $2, $3)
		RETURNING uuid
	`, todo.Date, todo.Title, todo.Description).Scan(&todoID)

	if err != nil {
		return "", fmt.Errorf("create todo: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return "", fmt.Errorf("commit transaction: %w", err)
	}
	return todoID, nil
}

// deleteExistingTodo removes the todo/day row for the given date, if one
// exists. It's a no-op (not an error) when there's nothing to delete.
func deleteExistingTodo(tx *sql.Tx, date string) error {
	var deletedUUID string
	err := tx.QueryRow(`
		DELETE FROM todo
		WHERE date = $1
		RETURNING uuid
	`, date).Scan(&deletedUUID)

	if err != nil && err != sql.ErrNoRows {
		return fmt.Errorf("delete existing todo: %w", err)
	}
	return nil
}

func GetTodosByDates(database *sql.DB, dates []string) (map[string]models.DailyTodo, error) {
	rows, err := database.Query(`
		SELECT
			uuid,
			date,
			title,
			description
		FROM todo
		WHERE date = ANY($1)
		ORDER BY date DESC
	`, dates)
	if err != nil {
		return nil, fmt.Errorf("query todos by dates: %w", err)
	}
	defer rows.Close()

	todosByDate := make(map[string]models.DailyTodo, 0)
	for rows.Next() {
		var todoUUID sql.NullString
		var date time.Time
		var title sql.NullString
		var description sql.NullString

		if err := rows.Scan(&todoUUID, &date, &title, &description); err != nil {
			return nil, fmt.Errorf("scan todo row: %w", err)
		}
		formattedDate := date.Format("2006-01-02")
		todosByDate[formattedDate] = models.DailyTodo{
			Date:        formattedDate,
			Title:       title.String,
			Description: description.String,
		}
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate todo rows: %w", err)
	}

	return todosByDate, nil
}
