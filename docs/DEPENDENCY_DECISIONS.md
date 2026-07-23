# NIK STREAMX — Pinned Dependency Decisions

All dependencies in NIK STREAMX are pinned to specific verified stable versions.

## Go Backend Services (`go.mod`)
- `Go`: `1.22.0`
- `github.com/gin-gonic/gin`: `v1.9.1`
- `github.com/golang-jwt/jwt/v5`: `v5.2.0`
- `github.com/google/uuid`: `v1.6.0`
- `github.com/lib/pq`: `v1.10.9`
- `github.com/redis/go-redis/v9`: `v9.5.1`

## Android Application (`build.gradle.kts`)
- `Kotlin`: `1.9.22`
- `Android Gradle Plugin`: `8.2.2`
- `Compose BOM`: `2024.02.00`
- `AndroidX Media3 ExoPlayer`: `1.3.0`
- `AndroidX Media3 UI`: `1.3.0`
- `AndroidX Media3 HLS`: `1.3.0`
- `AndroidX Media3 DASH`: `1.3.0`
- `AndroidX Navigation Compose`: `2.7.7`
- `Ktor Client / OkHttp`: `4.12.0`

## Infrastructure
- `PostgreSQL`: `16-alpine`
- `Redis`: `7.2-alpine`
- `MinIO`: `RELEASE.2024-01-31T00-00-00Z`
