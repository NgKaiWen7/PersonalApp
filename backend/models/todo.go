package models

type DailyTodo struct {
	Date        string `json:"date"`
	Title       string `json:"title"`
	Description string `json:"description"`
}
