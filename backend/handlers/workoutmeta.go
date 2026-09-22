package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"personalapp/db"
)

type WorkoutMetaHandler struct {
	database *sql.DB
}

func NewWorkoutMetaHandler(database *sql.DB) *WorkoutMetaHandler {
	return &WorkoutMetaHandler{
		database: database,
	}
}

func (h *WorkoutMetaHandler) Handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.list(w)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *WorkoutMetaHandler) list(w http.ResponseWriter) {
	totalLoad, err := db.GetTodayLoad(h.database)
	if err != nil {
		log.Printf("failed to fetch today's load: %v", err)
		http.Error(w, "failed to fetch today's load", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(totalLoad)
}
