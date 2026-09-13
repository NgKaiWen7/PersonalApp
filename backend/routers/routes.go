package routes

import (
	"database/sql"
	"net/http"

	"personalapp/handlers"
)

func Setup(database *sql.DB) http.Handler {
	mux := http.NewServeMux()

	todoHandler := handlers.NewTodoHandler(database)

	mux.HandleFunc("/api/todos", todoHandler.Handle)

	return mux
}
