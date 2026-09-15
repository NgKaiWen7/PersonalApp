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
	if err := deleteExistingTodo(tx, todo.Date); err != nil {
		return "", err
	}

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

// deleteExistingTodo removes the todo/day row for the given date, if one
// exists. It's a no-op (not an error) when there's nothing to delete.
func deleteExistingTodo(tx *sql.Tx, date string) error {
	var deletedUUID string
	err := tx.QueryRow(`
		DELETE FROM todo
		WHERE date = $1
		RETURNING todo_uuid
	`, date).Scan(&deletedUUID)

	if err != nil && err != sql.ErrNoRows {
		return fmt.Errorf("delete existing todo: %w", err)
	}

	return nil
}

func GetTodosByDates(database *sql.DB, dates []string) ([]models.DailyTodo, error) {
	rows, err := database.Query(`
		SELECT
			t.todo_uuid,
			t.date,
			k.title,
			k.description,
			k.status
		FROM todo t
		LEFT JOIN tasks k ON k.todo_uuid = t.todo_uuid
		WHERE t.date = ANY($1)
		ORDER BY t.date DESC, k.title ASC
	`, dates)
	if err != nil {
		return nil, fmt.Errorf("query todos by dates: %w", err)
	}
	defer rows.Close()

	days := make([]models.DailyTodo, 0)
	index := make(map[string]int)

	for rows.Next() {
		var (
			todoUUID, date string
			title          sql.NullString
			description    sql.NullString
			status         sql.NullBool
		)

		if err := rows.Scan(&todoUUID, &date, &title, &description, &status); err != nil {
			return nil, fmt.Errorf("scan todo row: %w", err)
		}

		i, exists := index[todoUUID]
		if !exists {
			days = append(days, models.DailyTodo{
				Date:  date,
				Tasks: []models.Task{},
			})
			i = len(days) - 1
			index[todoUUID] = i
		}

		if !title.Valid {
			continue
		}

		days[i].Tasks = append(days[i].Tasks, models.Task{
			Title:       title.String,
			Description: description.String,
			Status:      status.Bool,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate todo rows: %w", err)
	}

	return days, nil
}
