package db

import (
	"database/sql"
	"fmt"

	"personalapp/models"
)


func CreateTodo(database *sql.DB, todo models.DailyTodo) (string, error) {
	tx, err := database.Begin()
	if err != nil {
		return "", fmt.Errorf("begin transaction: %w", err)
	}

	defer tx.Rollback()

	// Delete the existing todo/day if it exists.
	var deletedUUID string
	err = tx.QueryRow(`
		DELETE FROM todo
		WHERE date = $1
		RETURNING todo_uuid
	`, todo.Date).Scan(&deletedUUID)

	// Create the todo/day.
	var todoID string

	err = tx.QueryRow(`
		INSERT INTO todo (date)
		VALUES ($1)
		RETURNING todo_uuid
	`, todo.Date).Scan(&todoID)

	if err != nil {
		return "", fmt.Errorf("create todo: %w", err)
	}

	// Create its tasks.
	for _, task := range todo.Tasks {
		_, err := tx.Exec(`
			INSERT INTO tasks (
				todo_uuid,
				title,
				description,
				status
			)
			VALUES ($1, $2, $3, $4)
		`,
			todoID,
			task.Title,
			task.Description,
			task.Status,
		)

		if err != nil {
			return "", fmt.Errorf("create task: %w", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return "", fmt.Errorf("commit transaction: %w", err)
	}

	return todoID, nil
}
