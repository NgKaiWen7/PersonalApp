package main

import (
	"log"
	"net/http"

	"personalapp/db"
	"personalapp/routers"
)

func main() {
	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	router := routes.Setup(database)

	log.Println("Server listening on :8080")

	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}
}
