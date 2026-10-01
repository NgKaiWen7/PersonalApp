package models

import "time"

type Notes struct {
	ID             string      `json:"id"`
	Title          string      `json:"title"`
	Description    string      `json:"description"`
	Category       string      `json:"category"`
	LastEditedDate time.Time   `json:"date"`
	NoteBlocks     []NoteBlock `json:"noteblocks"`
}

type NoteBlock struct {
	ID       string `json:"id"`
	NoteID   string `json:"noteid"`
	Position int    `json:"position"`
	Content  string `json:"content"`
	Type     string `json:"type"`
	Link     string `json:"link"`
}
type NoteBlockUpdate struct {
	Content *string `json:"content"`
	Link    *string `json:"link"`
	Type    *string `json:"type"`
}
type NoteUpdate struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Category    *string `json:"category"`
}
