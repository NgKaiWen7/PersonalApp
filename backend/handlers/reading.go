package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"personalapp/db"
)

type ReadingHandler struct {
	database *sql.DB
}

func NewReadingHandler(database *sql.DB) *ReadingHandler {
	return &ReadingHandler{
		database: database,
	}
}

func (h *ReadingHandler) Handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.get(w, r)
	case http.MethodPost:
		h.post(w, r)
	case http.MethodDelete:
		h.delete(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
func (h *ReadingHandler) get(w http.ResponseWriter, r *http.Request) {
	fileID := r.PathValue("id")

	if fileID == "" {
		h.list(w, r)
		return
	}

	h.getFile(w, r, fileID)
}

func (h *ReadingHandler) delete(w http.ResponseWriter, r *http.Request) {
	fileID := r.PathValue("id")
	tx, begin_err := h.database.Begin()
	if begin_err != nil {
		log.Printf("Failed to begin transaction: %v", begin_err)
		http.Error(w, "Unable to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	deleteFilePath, db_err := db.DeleteReadings(tx, fileID)
	if db_err != nil {
		http.Error(w, "Unable to delete file from database", http.StatusNotFound)
		return
	}
	if deleteFilePath == "" {
		http.Error(w, "No file found in database", http.StatusNotFound)
		return
	}
	err := os.Remove(deleteFilePath)
	if err != nil {
		log.Printf("Failed to delete file: %v", err)
		http.Error(w, "Failed to delete physical file", http.StatusInternalServerError)
		return
	}
	if err := tx.Commit(); err != nil {
		log.Printf("Failed to commit transaction: %v", err)
		http.Error(w, "Unable to commit deletion", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"deleted_file": deleteFilePath,
	})
}

func (h *ReadingHandler) list(w http.ResponseWriter, r *http.Request) {
	files, err := db.ListReadings(h.database)
	if err != nil {
		http.Error(w, "Unable to list any files", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(files)
}

func (h *ReadingHandler) getFile(w http.ResponseWriter, r *http.Request, fileID string) {
	filepath, err := db.GetReadings(h.database, fileID)
	if err != nil {
		http.Error(w, "Database unable to find file", http.StatusNotFound)
		return
	}
	http.ServeFile(w, r, filepath)
}

func (h *ReadingHandler) post(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	dst, err := os.Create(filepath.Join("/readings", header.Filename))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var fileid string
	fileid, err = db.CreateNewReadings(h.database, header.Filename, "/readings")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fileid))
}
