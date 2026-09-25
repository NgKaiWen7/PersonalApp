package db

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	"personalapp/models"
)

func CreateNewReadings(database *sql.DB, filename string, filedirectory string) (string, error) {
	var fileid string
	err := database.QueryRow(`
		INSERT INTO readings (filename, filedirectory)
		VALUES ($1, $2)
		RETURNING id
	`, filename, filedirectory).Scan(&fileid)

	if err != nil {
		return "", fmt.Errorf("Create readings : %w", err)
	}
	return fileid, err
}

func GetReadings(database *sql.DB, id string) (string, error) {
	var filename string
	var filepath string
	err := database.QueryRow(`
		SELECT filename, filedirectory FROM
		readings WHERE id = $1
	`, id).Scan(&filename, &filepath)
	if err != nil {
		return "", fmt.Errorf("Error getting file info: %w", err)
	}
	words := []string{filepath, filename}
	fullpath := strings.Join(words, "/")
	log.Println(fullpath)
	return fullpath, nil
}

func ListReadings(database *sql.DB) ([]models.Readings, error) {
	rows, err := database.Query(`
		SELECT id, title, description, category, filename, filedirectory
		FROM readings
	`)
	if err != nil {
		log.Printf("ListReadings: database.Query failed: %v", err)
		return nil, fmt.Errorf("query readings: %w", err)
	}
	defer rows.Close()

	var data []models.Readings

	for rows.Next() {
		var reading models.Readings
		var title sql.NullString
		var description sql.NullString
		var category sql.NullString

		err := rows.Scan(
			&reading.ID,
			&title,
			&description,
			&category,
			&reading.FileName,
			&reading.FileDirectory,
		)
		if err != nil {
			log.Printf("ListReadings: rows.Scan failed: %v", err)
			return nil, fmt.Errorf("scan reading: %w", err)
		}
		reading.Description = description.String
		reading.Category = category.String
		data = append(data, reading)
	}

	if err := rows.Err(); err != nil {
		log.Printf("ListReadings: rows iteration failed: %v", err)
		return nil, fmt.Errorf("iterate readings: %w", err)
	}

	log.Printf("ListReadings: successfully retrieved %d readings", len(data))

	return data, nil
}
