package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func Connect() (*sql.DB, error) {
	databaseURL := os.Getenv("DATABASE_URL")

	if databaseURL == "" {
		databaseURL = "postgres://filemanager:filemanager@localhost:5432/filemanager?sslmode=disable"
	}

	database, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	if err := database.Ping(); err != nil {
		database.Close()
		return nil, fmt.Errorf("ping database: %w", err)
	}

	return database, nil
}
