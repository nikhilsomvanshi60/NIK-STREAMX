package resolver

import (
	"fmt"
	"regexp"

	"github.com/google/uuid"
)

var (
	driveFilePathRegex = regexp.MustCompile(`drive\.google\.com/file/d/([a-zA-Z0-9_-]+)`)
	driveOpenIDRegex   = regexp.MustCompile(`drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)`)
	driveDirectIDRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{25,}$`)
)

// ExtractDriveFileID parses a Google Drive file ID from a URL or raw ID string.
func ExtractDriveFileID(rawInput string) (string, error) {
	if matches := driveFilePathRegex.FindStringSubmatch(rawInput); len(matches) > 1 {
		return matches[1], nil
	}
	if matches := driveOpenIDRegex.FindStringSubmatch(rawInput); len(matches) > 1 {
		return matches[1], nil
	}
	if driveDirectIDRegex.MatchString(rawInput) {
		return rawInput, nil
	}
	return "", fmt.Errorf("invalid Google Drive URL format or missing file ID")
}

// ParseDriveSource produces a normalized MediaDescriptor for a Google Drive file ID.
func ParseDriveSource(fileID string) (*MediaDescriptor, error) {
	if fileID == "" {
		return nil, fmt.Errorf("file ID cannot be empty")
	}

	// Official Google Drive playback URL endpoint
	streamURL := fmt.Sprintf("https://drive.google.com/uc?export=download&id=%s", fileID)

	descriptor := &MediaDescriptor{
		SourceID:        uuid.New().String(),
		SourceType:      "drive",
		ContentType:     "vod",
		Title:           fmt.Sprintf("Authorized Google Drive Movie (ID: %s)", fileID[:8]),
		PlaybackURL:     streamURL,
		Qualities:       []string{"1080p", "720p", "480p"},
		AudioTracks:     []string{"English (Original)"},
		SubtitleTracks:  []string{"English"},
		DownloadAllowed: true,
		ExpiresAt:       "2026-12-31T23:59:59Z",
	}

	return descriptor, nil
}
