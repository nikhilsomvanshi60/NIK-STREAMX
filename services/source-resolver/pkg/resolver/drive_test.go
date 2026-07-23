package resolver

import (
	"testing"
)

func TestExtractDriveFileID(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		wantID  string
		wantErr bool
	}{
		{
			name:    "Standard Drive View URL",
			input:   "https://drive.google.com/file/d/1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E/view?usp=drive_link",
			wantID:  "1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E",
			wantErr: false,
		},
		{
			name:    "Drive Open ID URL",
			input:   "https://drive.google.com/open?id=1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E",
			wantID:  "1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E",
			wantErr: false,
		},
		{
			name:    "Raw File ID",
			input:   "1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E",
			wantID:  "1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E",
			wantErr: false,
		},
		{
			name:    "Invalid Random URL",
			input:   "https://example.com/movie.mp4",
			wantID:  "",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotID, err := ExtractDriveFileID(tt.input)
			if (err != nil) != tt.wantErr {
				t.Fatalf("ExtractDriveFileID(%q) error = %v, wantErr %v", tt.input, err, tt.wantErr)
			}
			if gotID != tt.wantID {
				t.Errorf("ExtractDriveFileID(%q) = %q, want %q", tt.input, gotID, tt.wantID)
			}
		})
	}
}

func TestParseDriveSource(t *testing.T) {
	fileID := "1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E"
	descriptor, err := ParseDriveSource(fileID)
	if err != nil {
		t.Fatalf("ParseDriveSource failed: %v", err)
	}

	if descriptor.SourceType != "drive" {
		t.Errorf("expected SourceType 'drive', got '%s'", descriptor.SourceType)
	}
	if descriptor.ContentType != "vod" {
		t.Errorf("expected ContentType 'vod', got '%s'", descriptor.ContentType)
	}
}
