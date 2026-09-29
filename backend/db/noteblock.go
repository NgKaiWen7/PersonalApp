package db

import (
	"database/sql"
	"errors"
	"fmt"
	"personalapp/models"
	"strings"
)

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
func CreateNewNoteBlock(database *sql.DB, noteBlock models.NoteBlock) (models.NoteBlock, error) {
	var block models.NoteBlock

	err := database.QueryRow(`
		INSERT INTO note_blocks
			(note_id, position, content, type, link)
		VALUES
			(
				$1,
				COALESCE(
					(SELECT MAX(position) + 1
					 FROM note_blocks
					 WHERE note_id = $1),
					0
				),
				$2,
				$3,
				$4
			)
		RETURNING id, note_id, position, content, type, link
	`,
		noteBlock.NoteID,
		noteBlock.Content,
		noteBlock.Type,
		noteBlock.Link,
	).Scan(
		&block.ID,
		&block.NoteID,
		&block.Position,
		&block.Content,
		&block.Type,
		&block.Link,
	)

	if err != nil {
		return "", fmt.Errorf("Create NoteBlock: %w", err)
	}
	return block, nil
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
func PatchNoteBlock(database *sql.DB, noteBlockID string, updates map[string]any) (string, error) {
	var (
		setValues []string
		args      []any
		argIndex  = 1
	)

	if value, ok := updates["content"]; ok {
		setValues = append(setValues, fmt.Sprintf("content = $%d", argIndex))
		args = append(args, value)
		argIndex++
	}

	if value, ok := updates["type"]; ok {
		setValues = append(setValues, fmt.Sprintf("type = $%d", argIndex))
		args = append(args, value)
		argIndex++
	}

	if value, ok := updates["link"]; ok {
		setValues = append(setValues, fmt.Sprintf("link = $%d", argIndex))
		args = append(args, value)
		argIndex++
	}

	if len(setValues) == 0 {
		return "", fmt.Errorf("no valid fields to update")
	}

	args = append(args, noteBlockID)

	query := fmt.Sprintf(`
		UPDATE note_blocks
		SET %s
		WHERE id = $%d
		RETURNING id
	`, strings.Join(setValues, ", "), argIndex)

	var updatedID string

	err := database.QueryRow(query, args...).Scan(&updatedID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", fmt.Errorf("note block not found")
		}
		return "", fmt.Errorf("Patch NoteBlock: %w", err)
	}

	return updatedID, nil
}
