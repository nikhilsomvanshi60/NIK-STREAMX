package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	authServiceURL := getEnvOrDefault("AUTH_SERVICE_URL", "http://localhost:8081")
	resolverServiceURL := getEnvOrDefault("RESOLVER_SERVICE_URL", "http://localhost:8082")
	mediaServiceURL := getEnvOrDefault("MEDIA_SERVICE_URL", "http://localhost:8083")

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "api-gateway",
		})
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Enable strict CORS for client applications
		origin := r.Header.Get("Origin")
		if origin == "http://localhost:5173" || origin == "http://127.0.0.1:5173" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		}
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		path := r.URL.Path
		var targetURL string

		switch {
		case strings.HasPrefix(path, "/api/v1/auth"):
			targetURL = authServiceURL
		case strings.HasPrefix(path, "/api/v1/resolve"):
			targetURL = resolverServiceURL
		case strings.HasPrefix(path, "/api/v1/media"):
			targetURL = mediaServiceURL
		default:
			http.Error(w, `{"error":"Route not found"}`, http.StatusNotFound)
			return
		}

		proxyURL, err := url.Parse(targetURL)
		if err != nil {
			http.Error(w, `{"error":"Invalid upstream URL"}`, http.StatusInternalServerError)
			return
		}

		proxy := httputil.NewSingleHostReverseProxy(proxyURL)
		proxy.ServeHTTP(w, r)
	})

	log.Printf("API Gateway Service running on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func getEnvOrDefault(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
