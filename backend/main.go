package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	_ "github.com/jackc/pgx/v5/stdlib" // registers "pgx" driver for database/sql
	"personalapp/routes"
)

func main() {
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"postgres",
		"5432",
		"filemanager",
		"filemanager",
		"filemanager",
	)

	database, err := sql.Open("pgx", connStr)
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
	}
	defer database.Close()

	if err := database.Ping(); err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}

	router := routes.Setup(database)

	log.Println("Server listening on :8080")

	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}
}
