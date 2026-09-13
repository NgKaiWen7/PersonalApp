package models

type Task struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      bool   `json:"status"`
}

type DailyTodo struct {
	Date  string `json:"date"`
	Tasks []Task `json:"tasks"`
}
