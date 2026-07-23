package resolver

import (
	"testing"
)

func TestParseHLSManifest(t *testing.T) {
	masterPlaylist := []byte(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480
480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p.m3u8
#EXT-X-ENDLIST`)

	descriptor, err := ParseHLSManifest("https://example.com/master.m3u8", masterPlaylist)
	if err != nil {
		t.Fatalf("ParseHLSManifest failed: %v", err)
	}

	if descriptor.SourceType != "hls" {
		t.Errorf("expected SourceType 'hls', got '%s'", descriptor.SourceType)
	}

	if descriptor.ContentType != "vod" {
		t.Errorf("expected ContentType 'vod', got '%s'", descriptor.ContentType)
	}

	if len(descriptor.Qualities) != 4 {
		t.Errorf("expected 4 resolution qualities, got %d", len(descriptor.Qualities))
	}
}
