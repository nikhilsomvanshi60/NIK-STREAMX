# NIK STREAMX — Streaming Pipeline Architecture

## Playback Pipeline Overview
NIK STREAMX normalizes all media inputs into standardized descriptors consumed by native platform players (AndroidX Media3 ExoPlayer, Apple AVPlayer, Shaka Player).

```text
[ Incoming Source ] ---> [ Source Resolver ] ---> [ Normalized Descriptor ]
                                                          |
  +-------------------------------------------------------+
  |
  v
[ Player Engine ] ---> [ Adaptive Bitrate Controller ] ---> [ Diagnostics & Telemetry ]
 (ExoPlayer /            - Smoothed Throughput               - Time to First Frame
  AVPlayer /             - Buffer Occupancy                  - Rebuffer Count / Ratio
  Shaka Player)          - Thermal / Frame Drop Signals      - Current Bitrate & Latency
```

## Supported Media Types
1. **HLS (`.m3u8`)**: Master & Media playlists with TS or CMAF fragments. Low-Latency HLS (LL-HLS) supported via partial segment prefetching.
2. **MPEG-DASH (`.mpd`)**: Single and multi-period manifests with ISO-BMFF / CMAF representation chunks.
3. **Direct Progressive Media (`.mp4`, `.webm`, `.mkv`)**: Byte-range HTTP requests for seeking.
4. **Google Drive Integration**: OAuth2 tokenized retrieval via official Drive API v3 `/files/{id}?alt=media` stream endpoint.
