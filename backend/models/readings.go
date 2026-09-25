package models

type Readings struct {
	ID            string `json:"id"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	Category      string `json:"category"`
	FileDirectory string `json:"filedirectory"`
	FileName      string `json:"filename"`
}
