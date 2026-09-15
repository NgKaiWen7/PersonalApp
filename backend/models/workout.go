package models

type Workout struct {
	ID           string  `json:"id"`
	ExerciseType string  `json:"exercise_type"`
	Reps         int     `json:"reps"`
	Weight       float64 `json:"weight"`
}
