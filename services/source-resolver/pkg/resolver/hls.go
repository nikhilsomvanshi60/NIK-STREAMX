package resolver

import (
	"bufio"
	"bytes"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

// MediaDescriptor represents the normalized playback descriptor returned to client apps.
type MediaDescriptor struct {
	SourceID        string   `json:"sourceId"`
	SourceType      string   `json:"sourceType"`      // "hls", "dash", "progressive"
	ContentType     string   `json:"contentType"`     // "vod", "live"
	Title           string   `json:"title"`
	PlaybackURL     string   `json:"playbackUrl"`
	Qualities       []string `json:"qualities"`
	AudioTracks     []string `json:"audioTracks"`
	SubtitleTracks  []string `json:"subtitleTracks"`
	DownloadAllowed bool     `json:"downloadAllowed"`
	ExpiresAt       string   `json:"expiresAt"`
}

// ParseHLSManifest inspects an HLS .m3u8 playlist buffer and extracts stream metadata.
func ParseHLSManifest(rawURL string, manifestContent []byte) (*MediaDescriptor, error) {
	scanner := bufio.NewScanner(bytes.NewReader(manifestContent))
	isM3U8 := false
	isLive := true
	var qualities []string

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "#EXTM3U" {
			isM3U8 = true
		}
		if strings.HasPrefix(line, "#EXT-X-ENDLIST") {
			isLive = false
		}
		if strings.HasPrefix(line, "#EXT-X-STREAM-INF:") {
			if strings.Contains(line, "RESOLUTION=") {
				parts := strings.Split(line, "RESOLUTION=")
				if len(parts) > 1 {
					res := strings.Split(parts[1], ",")[0]
					qualities = append(qualities, res)
				}
			}
		}
	}

	if !isM3U8 {
		return nil, fmt.Errorf("invalid HLS playlist: missing #EXTM3U header")
	}

	if len(qualities) == 0 {
		qualities = []string{"1080p", "720p", "480p", "360p"}
	}

	contentType := "live"
	if !isLive {
		contentType = "vod"
	}

	descriptor := &MediaDescriptor{
		SourceID:        uuid.New().String(),
		SourceType:      "hls",
		ContentType:     contentType,
		Title:           "Authorized Stream Source",
		PlaybackURL:     rawURL,
		Qualities:       qualities,
		AudioTracks:     []string{"default"},
		SubtitleTracks:  []string{},
		DownloadAllowed: !isLive,
		ExpiresAt:       time.Now().Add(1 * time.Hour).Format(time.RFC3339),
	}

	return descriptor, nil
}
