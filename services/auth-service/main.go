package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refreshToken"`
	ExpiresAt    string `json:"expiresAt"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "auth-service",
		})
	})

	http.HandleFunc("/api/v1/auth/login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodPost {
			http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
			return
		}

		var req AuthRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" {
			http.Error(w, `{"error":"Invalid credentials"}`, http.StatusBadRequest)
			return
		}

		resp := AuthResponse{
			Token:        "signed-jwt-access-token-nik-streamx",
			RefreshToken: "refresh-token-nik-streamx",
			ExpiresAt:    time.Now().Add(15 * time.Minute).Format(time.RFC3339),
		}

		json.NewEncoder(w).Encode(resp)
	})

	log.Printf("Auth Service running on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
