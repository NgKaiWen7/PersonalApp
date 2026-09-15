package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"personalapp/db"
	"personalapp/models"
	"strings"
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
	switch r.Method {
	case http.MethodPost:
		h.create(w, r)
	case http.MethodGet:
		h.list(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *TodoHandler) create(w http.ResponseWriter, r *http.Request) {
	var day models.DailyTodo

	if err := json.NewDecoder(r.Body).Decode(&day); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if day.Date == "" {
		http.Error(w, "date is required", http.StatusBadRequest)
		return
	}

	todoUUID, err := db.CreateTodo(h.database, day)
	if err != nil {
		log.Printf("failed to create todo: %v", err)
		http.Error(w, "failed to create todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"todo_uuid": todoUUID,
	})
}

func (h *TodoHandler) list(w http.ResponseWriter, r *http.Request) {
	datesParam := r.URL.Query().Get("dates")
	if datesParam == "" {
		http.Error(w, "dates query param is required", http.StatusBadRequest)
		return
	}

	dates := strings.Split(datesParam, ",")

	days, err := db.GetTodosByDates(h.database, dates)
	if err != nil {
		log.Printf("failed to fetch todos: %v", err)
		http.Error(w, "failed to fetch todos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(days)
}
