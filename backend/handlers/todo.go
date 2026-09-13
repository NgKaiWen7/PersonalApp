package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"personalapp/db"
	"personalapp/models"
)

type TodoHandler struct {
	database *sql.DB
}

func NewTodoHandler(database *sql.DB) *TodoHandler {
	return &TodoHandler{
		database: database,
	}
}

func (h *TodoHandler) Handle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var todo models.DailyTodo

	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if todo.Date == "" {
		http.Error(w, "date is required", http.StatusBadRequest)
		return
	}

	id, err := db.CreateTodo(h.database, todo)
	if err != nil {
		log.Printf("failed to create todo: %v", err)
		http.Error(w, "failed to create todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(map[string]any{
		"id": id,
	})
}
