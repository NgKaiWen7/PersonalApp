package db

import (
	"database/sql"
	"fmt"

	"personalapp/models"
)

func CreateWorkout(database *sql.DB, workout models.Workout) (string, error) {
	var workoutID string

	err := database.QueryRow(`
		INSERT INTO workouts (
			exercise_type,
			reps,
			weight
		)
		VALUES ($1,$2, $3)
		RETURNING id
	`,
		workout.ExerciseType,
		workout.Reps,
		workout.Weight,
	).Scan(&workoutID)

	if err != nil {
		return "", fmt.Errorf("create workout: %w", err)
	}

	return workoutID, nil
}

func UpdateWorkout(database *sql.DB, workout models.Workout) (string, error) {
	var workoutID string

	err := database.QueryRow(`
		UPDATE workouts SET
			exercise_type = $1,
			reps = $2,
			weight = $3
		WHERE id = $4
		RETURNING id
	`, workout.ExerciseType,
		workout.Reps,
		workout.Weight,
		workout.ID,
	).Scan(&workoutID)

	if err != nil {
		return "", fmt.Errorf("create workout: %w", err)
	}

	return workoutID, nil
}

func GetWorkoutsByDate(database *sql.DB, date string) ([]models.Workout, error) {
	rows, err := database.Query(`
		SELECT id, exercise_type, reps, weight
		FROM workouts
		WHERE created_at::date = $1
		ORDER BY created_at ASC
	`, date)
	if err != nil {
		return nil, fmt.Errorf("query workouts by date: %w", err)
	}
	defer rows.Close()

	workouts := make([]models.Workout, 0)

	for rows.Next() {
		var workout models.Workout

		if err := rows.Scan(
			&workout.ID,
			&workout.ExerciseType,
			&workout.Reps,
			&workout.Weight,
		); err != nil {
			return nil, fmt.Errorf("scan workout row: %w", err)
		}

		workouts = append(workouts, workout)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate workout rows: %w", err)
	}

	return workouts, nil
}
func DeleteWorkout(database *sql.DB, workoutUUID string) (int64, error) {
	result, err := database.Exec(`
		DELETE FROM workouts
		WHERE id = $1
	`, workoutUUID)

	if err != nil {
		return 0, fmt.Errorf("delete workout: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("get rows affected: %w", err)
	}

	return rowsAffected, nil
}
