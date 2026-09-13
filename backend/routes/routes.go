package routes

import (
	"database/sql"
	"net/http"

	"personalapp/handlers"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // or specific origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func Setup(database *sql.DB) http.Handler {
	mux := http.NewServeMux()

	todoHandler := handlers.NewTodoHandler(database)

	mux.HandleFunc("/api/todos", todoHandler.Handle)

	return corsMiddleware(mux)
}
