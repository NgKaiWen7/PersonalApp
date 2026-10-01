package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"personalapp/db"
	"personalapp/models"
)

type NoteBlockHandler struct {
	database *sql.DB
}

func NewNoteBlockHandler(database *sql.DB) *NoteBlockHandler {
	return &NoteBlockHandler{
		database: database,
	}
}
func (h *NoteBlockHandler) Handle(w http.ResponseWriter, r *http.Request) {
	switch r.Pattern {
	case "/api/notes/{id}/blocks/reorder":
		if r.Method != http.MethodPatch {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		h.reorder(w, r)

	case "/api/noteblock/{id}":
		switch r.Method {
		case http.MethodGet:
			h.get(w, r)
		case http.MethodPatch:
			h.patch(w, r)
		case http.MethodDelete:
			h.delete(w, r)
		case http.MethodPost:
			h.post(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}

	default:
		http.NotFound(w, r)
	}
}
func (h *NoteBlockHandler) reorder(w http.ResponseWriter, r *http.Request) {
	noteID := r.PathValue("noteID")
	if noteID == "" {
		http.Error(w, "Note ID is required", http.StatusBadRequest)
		return
	}
	var req struct {
		Order []string `json:"order"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if err := db.ReorderNoteBlocks(h.database, noteID, req.Order); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
func (h *NoteBlockHandler) get(w http.ResponseWriter, r *http.Request) {
	noteBlockID := r.PathValue("id")

	if noteBlockID == "" {
		http.Error(w, "Note block ID is required", http.StatusBadRequest)
		return
	}

	noteBlock, err := db.GetNoteBlocks(h.database, noteBlockID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "Note block not found", http.StatusNotFound)
			return
		}

		http.Error(w, "Error getting note block", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(noteBlock)
}
func (h *NoteBlockHandler) patch(w http.ResponseWriter, r *http.Request) {
	noteBlockID := r.PathValue("id")
	if noteBlockID == "" {
		http.Error(w, "Note block ID is required", http.StatusBadRequest)
		return
	}
	var updates models.NoteBlockUpdate

	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if err := db.PatchNoteBlock(h.database, noteBlockID, updates); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
func (h *NoteBlockHandler) post(w http.ResponseWriter, r *http.Request) {
	noteID := r.PathValue("id")
	var req struct {
		Type string `json:"type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if req.Type == "" {
		http.Error(w, "Type is required", http.StatusBadRequest)
		return
	}
	newBlockID, err := db.CreateNewNoteBlock(h.database, noteID, req.Type)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(newBlockID))
}
func (h *NoteBlockHandler) delete(w http.ResponseWriter, r *http.Request) {
	noteBlockID := r.PathValue("id")
	if noteBlockID == "" {
		http.Error(w, "Note block ID is required", http.StatusBadRequest)
		return
	}
	deletedID, err := db.DeleteNoteBlock(h.database, noteBlockID)
	if err != nil {
		http.Error(w, "Error deleting note block", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"id": deletedID,
	})
}
