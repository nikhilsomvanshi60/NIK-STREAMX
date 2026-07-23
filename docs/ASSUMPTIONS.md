# NIK STREAMX — Engineering Assumptions & System Defaults

1. **User Ownership**: All stream URLs provided to NIK STREAMX belong to media owned, licensed, or legally accessible by the user.
2. **Standard Port Allocation**:
   - `api-gateway`: `8080`
   - `auth-service`: `8081`
   - `source-resolver`: `8082`
   - `media-service`: `8083`
   - `PostgreSQL`: `5432`
   - `Redis`: `6379`
   - `MinIO Storage`: `9000` / Console `9001`
3. **Adaptive Bitrate Default Profile**: Auto mode (smoothed throughput target with 1.25x safety factor).
4. **Playback Buffer Targets**: Initial buffer 2.5s, max buffer 30s for VOD; initial buffer 1.0s, max buffer 5s for LL-HLS.
5. **SSRF Redirect Limit**: Maximum 3 redirects followed during media source resolution.
