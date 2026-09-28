package db

import (
	"database/sql"
	"fmt"
	"personalapp/models"
	"strings"
)

func CreateNewNotes(database *sql.DB, notes models.Notes) (string, error) {
	tx, err := database.Begin()
	if err != nil {
		return "", fmt.Errorf("begin transaction: %w", err)
	}
	defer tx.Rollback()

	var noteID string

	err = tx.QueryRow(`
		INSERT INTO notes (title, description, category)
		VALUES ($1, $2, $3)
		RETURNING id
	`, notes.Title, notes.Description, notes.Category).Scan(&noteID)

	if err != nil {
		return "", fmt.Errorf("create note: %w", err)
	}

	for _, block := range notes.NoteBlocks {
		_, err = tx.Exec(`
			INSERT INTO note_blocks
				(note_id, position, content, type, link)
			VALUES
				($1, $2, $3, $4, $5)
		`,
			noteID,
			block.Position,
			block.Content,
			block.Type,
			block.Link,
		)

		if err != nil {
			return "", fmt.Errorf("create note block: %w", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return "", fmt.Errorf("commit note: %w", err)
	}

	return noteID, nil
}
func DeleteNotes(database *sql.DB, noteid string) (string, error) {
	_, err := database.Exec(`
		DELETE FROM notes WHERE id = $1
	`, noteid)
	if err != nil {
		return "", fmt.Errorf("Delete Notes : %w", err)
	}
	return noteid, err
}
func GetNotes(database *sql.DB, noteID string, page int) ([]models.Notes, error) {
	const pageSize = 50

	if page < 1 {
		page = 1
	}

	offset := (page - 1) * pageSize

	var rows *sql.Rows
	var err error

	if noteID == "" {
		rows, err = database.Query(`
			SELECT
				id,
				title,
				description,
				category,
				last_edited_date
			FROM notes
			ORDER BY last_edited_date DESC
			LIMIT $1 OFFSET $2
		`, pageSize, offset)

		if err != nil {
			return nil, fmt.Errorf("get notes: %w", err)
		}
		defer rows.Close()

		notes := make([]models.Notes, 0)

		for rows.Next() {
			var note models.Notes

			err := rows.Scan(
				&note.ID,
				&note.Title,
				&note.Description,
				&note.Category,
				&note.LastEditedDate,
			)
			if err != nil {
				return nil, fmt.Errorf("scan note: %w", err)
			}

			notes = append(notes, note)
		}

		if err := rows.Err(); err != nil {
			return nil, fmt.Errorf("iterate notes: %w", err)
		}

		return notes, nil
	}

	// Get one note with its blocks.
	rows, err = database.Query(`
		SELECT
			n.id,
			n.title,
			n.description,
			n.category,
			n.last_edited_date,
			nb.id,
			nb.note_id,
			nb.position,
			nb.content,
			nb.type,
			nb.link
		FROM notes n
		LEFT JOIN note_blocks nb
			ON nb.note_id = n.id
		WHERE n.id = $1
		ORDER BY nb.position ASC
	`, noteID)

	if err != nil {
		return nil, fmt.Errorf("get note: %w", err)
	}
	defer rows.Close()

	notes := make([]models.Notes, 0)
	var currentNote *models.Notes

	for rows.Next() {
		var (
			note      models.Notes
			blockID   sql.NullString
			blockNote sql.NullString
			position  sql.NullInt64
			content   sql.NullString
			blockType sql.NullString
			link      sql.NullString
		)

		err := rows.Scan(
			&note.ID,
			&note.Title,
			&note.Description,
			&note.Category,
			&note.LastEditedDate,
			&blockID,
			&blockNote,
			&position,
			&content,
			&blockType,
			&link,
		)
		if err != nil {
			return nil, fmt.Errorf("scan note: %w", err)
		}

		if currentNote == nil || currentNote.ID != note.ID {
			note.NoteBlocks = make([]models.NoteBlock, 0)
			notes = append(notes, note)
			currentNote = &notes[len(notes)-1]
		}

		if blockID.Valid {
			currentNote.NoteBlocks = append(
				currentNote.NoteBlocks,
				models.NoteBlock{
					ID:       blockID.String,
					NoteID:   blockNote.String,
					Position: int(position.Int64),
					Content:  content.String,
					Type:     blockType.String,
					Link:     link.String,
				},
			)
		}
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate note: %w", err)
	}

	return notes, nil
}

func PatchNotes(database *sql.DB, noteID string, updates map[string]any) (string, error) {
	var (
		setValues []string
		args      []any
		argIndex  = 1
	)

	if value, ok := updates["title"]; ok {
		setValues = append(setValues, fmt.Sprintf("title = $%d", argIndex))
		args = append(args, value)
		argIndex++
	}

	if value, ok := updates["description"]; ok {
		setValues = append(setValues, fmt.Sprintf("description = $%d", argIndex))
		args = append(args, value)
		argIndex++
	}

	if value, ok := updates["category"]; ok {
		setValues = append(setValues, fmt.Sprintf("category = $%d", argIndex))
		args = append(args, value)
		argIndex++
	}

	if len(setValues) == 0 {
		return "", fmt.Errorf("no valid fields to update")
	}

	setValues = append(setValues, "last_edited_date = NOW()")

	args = append(args, noteID)

	query := fmt.Sprintf(`
		UPDATE notes
		SET %s
		WHERE id = $%d
		RETURNING id
	`, strings.Join(setValues, ", "), argIndex)

	var updatedID string

	err := database.QueryRow(query, args...).Scan(&updatedID)
	if err != nil {
		return "", fmt.Errorf("Patch Notes: %w", err)
	}

	return updatedID, nil
}
