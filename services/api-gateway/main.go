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
		// Enable CORS for client applications
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

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
