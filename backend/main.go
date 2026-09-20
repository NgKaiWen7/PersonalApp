package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"personalapp/routes"

	"golang.org/x/crypto/argon2"

	_ "github.com/jackc/pgx/v5/stdlib" // registers "pgx" driver for database/sql
)

func main() {
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"postgres",
		"5432",
		"filemanager",
		"filemanager",
		"filemanager",
	)

	database, err := sql.Open("pgx", connStr)
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
	}
	defer database.Close()

	if err := database.Ping(); err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	router := routes.Setup(database)

	log.Println("Server listening on :8080")

	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}
}

func InitUser(database *sql.DB, username string, password string) error {
	passwordHash, err := HashPassword(password)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	_, err = database.Exec(`
		INSERT INTO users (username, password_hash)
		VALUES ($1, $2)
	`, username, passwordHash)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}
func HashPassword(password string) (string, error) {
	const (
		timeCost = 3
		memory   = 64 * 1024
		threads  = 4
		keyLen   = 32
		saltLen  = 16
	)

	salt := make([]byte, saltLen)

	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	hash := argon2.IDKey(
		[]byte(password),
		salt,
		timeCost,
		memory,
		threads,
		keyLen,
	)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	return fmt.Sprintf(
		"$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
		memory,
		timeCost,
		threads,
		b64Salt,
		b64Hash,
	), nil
}
