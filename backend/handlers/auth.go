package handlers

import (
	"crypto/rand"
	"crypto/subtle"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"golang.org/x/crypto/argon2"
)

const (
	login_time = 3
	memory     = 64 * 1024
	threads    = 4
	keyLen     = 32
	saltLen    = 16
)

type AuthHandler struct {
	database *sql.DB
}

func NewAuthHandler(database *sql.DB) *AuthHandler {
	return &AuthHandler{
		database: database,
	}
}

func (h *AuthHandler) Handle(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.post(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *AuthHandler) post(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")
	password := r.URL.Query().Get("password")

	var passwordHash string

	err := h.database.QueryRow(`
		SELECT password_hash
		FROM users
		WHERE username = $1
	`, user).Scan(&passwordHash)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "invalid username: "+user, http.StatusUnauthorized)
			return
		}

		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	valid, err := VerifyPassword(password, passwordHash)
	if err != nil {
		http.Error(w, "authentication error", http.StatusInternalServerError)
		return
	}

	if !valid {
		http.Error(w, "invalid username or password", http.StatusUnauthorized)
		return
	}

	// Authentication succeeded.
	// Generate your token here.
	tokenBytes := make([]byte, 32)

	_, err = rand.Read(tokenBytes)
	if err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}

	token := base64.RawURLEncoding.EncodeToString(tokenBytes)
	_, err = h.database.Exec(`
    UPDATE users
    SET token = $1,
        validated_at = NOW()
    WHERE username = $2
	`, token, user)

	if err != nil {
		http.Error(w, "Failed to update authentication token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}

func VerifyPassword(password string, encodedHash string) (bool, error) {
	parts := strings.Split(encodedHash, "$")

	if len(parts) != 6 {
		return false, errors.New("invalid password hash format")
	}

	var memory uint32
	var time uint32
	var threads uint8

	_, err := fmt.Sscanf(
		parts[3],
		"m=%d,t=%d,p=%d",
		&memory,
		&time,
		&threads,
	)
	if err != nil {
		return false, err
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, err
	}

	expectedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, err
	}

	actualHash := argon2.IDKey(
		[]byte(password),
		salt,
		time,
		memory,
		threads,
		uint32(len(expectedHash)),
	)

	return subtle.ConstantTimeCompare(
		actualHash,
		expectedHash,
	) == 1, nil
}
