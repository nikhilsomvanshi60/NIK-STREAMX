package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type MediaItem struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	StreamURL   string   `json:"streamUrl"`
	PosterURL   string   `json:"posterUrl"`
	SourceType  string   `json:"sourceType"`
	Tags        []string `json:"tags"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "media-service",
		})
	})

	http.HandleFunc("/api/v1/media/items", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		items := []MediaItem{
			{
				ID:          "m-drive-001",
				Title:       "Authorized Google Drive Movie",
				Description: "Development test movie sourced from authorized Google Drive file ID: 1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E.",
				StreamURL:   "https://drive.google.com/file/d/1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E/view?usp=drive_link",
				PosterURL:   "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
				SourceType:  "drive",
				Tags:        []string{"1080p", "Google Drive", "Movie"},
			},
			{
				ID:          "m-001",
				Title:       "Legal HLS Open Test Stream (Big Buck Bunny)",
				Description: "Official legal HLS adaptive bitrate stream for playback verification.",
				StreamURL:   "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
				PosterURL:   "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
				SourceType:  "hls",
				Tags:        []string{"4K", "HLS", "Test"},
			},
			{
				ID:          "m-002",
				Title:       "Authorized Live Stream Showcase",
				Description: "Low-Latency HLS live broadcast stream.",
				StreamURL:   "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
				PosterURL:   "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800",
				SourceType:  "hls",
				Tags:        []string{"Live", "LL-HLS"},
			},
		}

		json.NewEncoder(w).Encode(items)
	})

	log.Printf("Media Service running on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
