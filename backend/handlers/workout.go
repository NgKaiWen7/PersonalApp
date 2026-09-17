package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"personalapp/db"
	"personalapp/models"
	"time"
)

type WorkoutHandler struct {
	database *sql.DB
}

func NewWorkoutHandler(database *sql.DB) *WorkoutHandler {
	return &WorkoutHandler{
		database: database,
	}
}

func (h *WorkoutHandler) Handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.create(w, r)
	case http.MethodGet:
		h.list(w, r)
	case http.MethodPut:
		h.update(w, r)
	case http.MethodDelete:
		h.delete(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *WorkoutHandler) create(w http.ResponseWriter, r *http.Request) {
	var workout models.Workout

	if err := json.NewDecoder(r.Body).Decode(&workout); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if workout.ExerciseType == "" {
		http.Error(w, "exercise_type is required", http.StatusBadRequest)
		return
	}
	if workout.Reps <= 0 {
		http.Error(w, "reps must be greater than 0", http.StatusBadRequest)
		return
	}
	if workout.Weight <= 0 {
		http.Error(w, "weight must be greater than 0", http.StatusBadRequest)
		return
	}
	workoutUUID, err := db.CreateWorkout(h.database, workout)
	if err != nil {
		log.Printf("failed to create workout: %v", err)
		http.Error(w, "failed to create workout", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"id": workoutUUID,
	})
}

func (h *WorkoutHandler) update(w http.ResponseWriter, r *http.Request) {
	var workout models.Workout
	uuid := r.URL.Query().Get("uuid")
	if uuid == "" {
		http.Error(w, "uuid query param is required", http.StatusBadRequest)
		return
	}
	workout.ID = uuid
	if err := json.NewDecoder(r.Body).Decode(&workout); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if workout.ExerciseType == "" {
		http.Error(w, "exercise_type is required", http.StatusBadRequest)
		return
	}
	if workout.Reps <= 0 {
		http.Error(w, "reps must be greater than 0", http.StatusBadRequest)
		return
	}
	if workout.Weight <= 0 {
		http.Error(w, "weight must be greater than 0", http.StatusBadRequest)
		return
	}
	workoutUUID, err := db.UpdateWorkout(h.database, workout)
	if err != nil {
		log.Printf("failed to update workout: %v", err)
		http.Error(w, "failed to update workout", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"id": workoutUUID,
	})
}

func (h *WorkoutHandler) list(w http.ResponseWriter, r *http.Request) {
	// date := r.URL.Query().Get("date")
	// if date == "" {
	// 	date = time.Now().Format("2006-01-02")
	// }
	loc := time.FixedZone("UTC+8", 8*60*60)
	date := time.Now().In(loc).Format("2006-01-02")
	workouts, err := db.GetWorkoutsByDate(h.database, date)
	fmt.Println(date)

	if err != nil {
		log.Printf("failed to fetch workouts: %v", err)
		http.Error(w, "failed to fetch workouts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(workouts)
}

func (h *WorkoutHandler) delete(w http.ResponseWriter, r *http.Request) {
	uuid := r.URL.Query().Get("uuid")
	if uuid == "" {
		http.Error(w, "uuid query param is required", http.StatusBadRequest)
		return
	}

	rowsAffected, err := db.DeleteWorkout(h.database, uuid)
	if err != nil {
		log.Printf("failed to delete workout: %v", err)
		http.Error(w, "failed to delete workout", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "workout not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
