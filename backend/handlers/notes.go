package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"personalapp/db"
	"personalapp/models"
	"strconv"
)

type NotesHandler struct {
	database *sql.DB
}

func NewNotesHandler(database *sql.DB) *NotesHandler {
	return &NotesHandler{
		database: database,
	}
}

func (h *NotesHandler) Handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.get(w, r)
	case http.MethodPatch:
		h.patch(w, r)
	case http.MethodPost:
		h.post(w, r)
	case http.MethodDelete:
		h.delete(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
func (h *NotesHandler) get(w http.ResponseWriter, r *http.Request) {
	noteID := r.PathValue("id")

	page := 1

	if pageParam := r.URL.Query().Get("page"); pageParam != "" {
		parsedPage, err := strconv.Atoi(pageParam)
		if err != nil || parsedPage < 1 {
			http.Error(w, "Invalid page", http.StatusBadRequest)
			return
		}
		page = parsedPage
	}

	notes, err := db.GetNotes(h.database, noteID, page)
	if err != nil {
		http.Error(w, "Error getting notes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if noteID != "" {
		if len(notes) == 0 {
			http.Error(w, "Note not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(notes[0])
		return
	}

	if err := json.NewEncoder(w).Encode(notes); err != nil {
		http.Error(w, "Error encoding notes", http.StatusInternalServerError)
		return
	}
}

func (h *NotesHandler) patch(w http.ResponseWriter, r *http.Request) {
	noteID := r.PathValue("id")

	if noteID == "" {
		http.Error(w, "Note ID is required", http.StatusBadRequest)
		return
	}

	var updates map[string]any

	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	updatedID, err := db.PatchNotes(h.database, noteID, updates)
	if err != nil {
		http.Error(w, "Error updating note", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"id": updatedID,
	})
}

func (h *NotesHandler) post(w http.ResponseWriter, r *http.Request) {
	var notes models.Notes
	if err := json.NewDecoder(r.Body).Decode(&notes); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	noteID, err := db.CreateNewNotes(h.database, notes)
	if err != nil {
		http.Error(w, "Error creating note", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"id": noteID,
	})
}

func (h *NotesHandler) delete(w http.ResponseWriter, r *http.Request) {
	noteID := r.PathValue("id")

	if noteID == "" {
		http.Error(w, "Note ID is required", http.StatusBadRequest)
		return
	}

	deletedID, err := db.DeleteNotes(h.database, noteID)
	if err != nil {
		http.Error(w, "Error deleting note", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"id": deletedID,
	})
}
