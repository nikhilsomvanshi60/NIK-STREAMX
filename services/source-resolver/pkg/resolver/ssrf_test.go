package resolver

import (
	"testing"
)

func TestValidateURL(t *testing.T) {
	tests := []struct {
		name    string
		url     string
		wantErr bool
	}{
		{
			name:    "Valid HTTPS Public URL",
			url:     "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
			wantErr: false,
		},
		{
			name:    "Blocked Scheme file://",
			url:     "file:///etc/passwd",
			wantErr: true,
		},
		{
			name:    "Blocked Scheme ftp://",
			url:     "ftp://example.com/stream.mp4",
			wantErr: true,
		},
		{
			name:    "Blocked Localhost",
			url:     "http://localhost:8080/secret",
			wantErr: true,
		},
		{
			name:    "Blocked IPv4 Loopback",
			url:     "http://127.0.0.1/admin",
			wantErr: true,
		},
		{
			name:    "Blocked Cloud Metadata IP",
			url:     "http://169.254.169.254/latest/meta-data/",
			wantErr: true,
		},
		{
			name:    "Blocked Private IP Range",
			url:     "http://192.168.1.1/router",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateURL(tt.url)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateURL(%q) error = %v, wantErr %v", tt.url, err, tt.wantErr)
			}
		})
	}
}
