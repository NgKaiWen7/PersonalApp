package db

import (
	"database/sql"
	"fmt"
	"personalapp/models"
	"strings"
)

func ReorderNoteBlocks(database *sql.DB, noteID string, order []string) error {
	tx, err := database.Begin()
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}
	defer tx.Rollback()
	for position, blockID := range order {
		_, err := tx.Exec(`
			UPDATE note_blocks
			SET position = $1
			WHERE id = $2
			  AND note_id = $3
		`,
			position,
			blockID,
			noteID,
		)
		if err != nil {
			return fmt.Errorf("reorder note block: %w", err)
		}
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit reorder: %w", err)
	}
	return nil
}
func GetNoteBlocks(database *sql.DB, noteBlockID string) (models.NoteBlock, error) {
	var block models.NoteBlock
	err := database.QueryRow(`
		SELECT id, note_id, position, content, type, link
		FROM note_blocks
		WHERE id = $1
	`, noteBlockID).Scan(
		&block.ID,
		&block.NoteID,
		&block.Position,
		&block.Content,
		&block.Type,
		&block.Link,
	)
	if err != nil {
		return block, fmt.Errorf("Get NoteBlock: %w", err)
	}
	return block, nil
}
func CreateNewNoteBlock(database *sql.DB, note_id string, content_type string) (string, error) {
	var id string
	err := database.QueryRow(`
		INSERT INTO note_blocks
			(note_id, position, type)
		VALUES
			(
				$1,
				COALESCE(
					(SELECT MAX(position) + 1
					 FROM note_blocks
					 WHERE note_id = $1),
					0
				),
				$2
			)
		RETURNING id
	`,
		note_id,
		content_type,
	).Scan(&id)
	if err != nil {
		return id, fmt.Errorf("Create NoteBlock: %w", err)
	}
	return id, nil
}
func DeleteNoteBlock(database *sql.DB, noteBlockID string) (string, error) {
	_, err := database.Exec(`
		DELETE FROM note_blocks
		WHERE id = $1
	`, noteBlockID)
	if err != nil {
		return "", fmt.Errorf("Delete NoteBlock: %w", err)
	}
	return noteBlockID, nil
}
func PatchNoteBlock(database *sql.DB, noteBlockID string, updates models.NoteBlockUpdate) error {
	var (
		setValues []string
		args      []any
		argIndex  = 1
	)
	if updates.Content != nil {
		setValues = append(setValues, fmt.Sprintf("content = $%d", argIndex))
		args = append(args, *updates.Content)
		argIndex++
	}
	if updates.Type != nil {
		setValues = append(setValues, fmt.Sprintf("type = $%d", argIndex))
		args = append(args, *updates.Type)
		argIndex++
	}
	if updates.Link != nil {
		setValues = append(setValues, fmt.Sprintf("link = $%d", argIndex))
		args = append(args, *updates.Link)
		argIndex++
	}
	if len(setValues) == 0 {
		return fmt.Errorf("no valid fields to update")
	}
	args = append(args, noteBlockID)
	query := fmt.Sprintf(`
		UPDATE note_blocks
		SET %s
		WHERE id = $%d
	`, strings.Join(setValues, ", "), argIndex)
	result, err := database.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("patch note block: %w", err)
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("check patched note block: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("note block not found")
	}
	return nil
}
