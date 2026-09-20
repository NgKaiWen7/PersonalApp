package routes

import (
	"database/sql"
	"errors"
	"net/http"
	"strings"

	"personalapp/handlers"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "https://nkwzotero.uk")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func AuthMiddleware(db *sql.DB, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)

		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		token := parts[1]

		var userUUID string

		err := db.QueryRow(`
			SELECT username
			FROM users
			WHERE token = $1
			AND validated_date > NOW()
		`, token).Scan(&userUUID)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func Setup(database *sql.DB) http.Handler {
	mux := http.NewServeMux()

	todoHandler := handlers.NewTodoHandler(database)
	workoutHandler := handlers.NewWorkoutHandler(database)
	authHandler := handlers.NewAuthHandler(database)

	mux.Handle("/api/todos", AuthMiddleware(database, http.HandlerFunc(todoHandler.Handle)))
	mux.Handle("/api/workouts", AuthMiddleware(database, http.HandlerFunc(workoutHandler.Handle)))
	mux.HandleFunc("/api/auth", authHandler.Handle)
	return corsMiddleware(mux)
}
