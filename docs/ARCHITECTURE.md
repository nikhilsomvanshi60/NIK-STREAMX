# NIK STREAMX — System Architecture Document

## Overview
NIK STREAMX is a production-grade, multi-platform video streaming architecture designed to deliver user-owned, licensed live and on-demand media securely and with ultra-low latency.

## Monorepo Layout
```text
nik-streamx/
├── apps/
│   ├── android/             # Android Phone & TV App (Kotlin, Compose, Media3 ExoPlayer)
│   ├── apple/               # iOS & tvOS App (Swift, SwiftUI, AVFoundation)
│   ├── tv-web/              # Samsung Tizen & LG webOS (TypeScript, React, Shaka Player)
│   ├── web/                 # Progressive Web App & Web Browser (React/Vite)
│   └── admin-console/       # Operations & Telemetry Admin Web Console
├── services/
│   ├── api-gateway/         # Go API Gateway (Reverse proxy, JWT auth middleware, rate limiter)
│   ├── auth-service/        # Go Auth Service (OAuth2, OIDC, JWT tokens, session management)
│   ├── media-service/       # Go Media Catalog (Library metadata, watch history, playback sessions)
│   ├── source-resolver/     # Go Source Resolver (SSRF defense, HLS/DASH manifest parser)
│   ├── download-service/    # Go Download Policy & Offline License Broker
│   ├── transcode-worker/    # Go/FFmpeg Transcoding & Packaging Worker
│   ├── notification-service/# Go Real-time Push & WebSocket Notification Engine
│   └── analytics-service/   # Go Telemetry & Playback Quality of Experience (QoE) Ingestion
├── packages/
│   ├── api-contracts/       # OpenAPI 3.1 specs & JSON Schemas
│   ├── design-tokens/       # Cinema Control Deck theme tokens
│   ├── media-models/        # Common media descriptors & streaming schemas
│   ├── telemetry-schema/    # QoE metrics schemas
│   └── test-fixtures/      # Reusable mock manifests, streams & media files
├── infra/
│   ├── docker/              # Local Docker Compose setup & Dockerfiles
│   ├── kubernetes/          # Helm charts & K8s deployment manifests
│   └── terraform/           # Infrastructure as Code templates
├── docs/                    # Architectural & Operational documentation
└── Makefile                 # Build, test, and container orchestration tasks
```

## System Topology & Data Flow
1. **Client Request**: Client submits a media URL or selects a item from catalog.
2. **Gateway**: `api-gateway` validates JWT tokens and routes requests to appropriate service.
3. **Source Resolver**: `source-resolver` inspects incoming media URLs, applies strict SSRF checks (blocking loopback, private ranges, metadata endpoints), fetches and validates HLS/DASH manifests, and returns a normalized `MediaDescriptor`.
4. **Playback Session**: Client initiates playback using short-lived signed URLs with adaptive bitrate streaming (HLS / LL-HLS / DASH).
5. **Telemetry**: Client reports QoE metrics (buffering duration, bitrate switches, dropped frames) asynchronously to `analytics-service`.
