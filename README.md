# NIK STREAMX — Multi-Platform Ultra-Premium Streaming Platform

NIK STREAMX is a production-grade multi-platform streaming application supporting Android (Phone & TV), iOS, tvOS, Smart TVs (Samsung Tizen, LG webOS), and Web browsers.

## Project Monorepo Structure
- `apps/android`: Android Phone & TV App built with Kotlin, Jetpack Compose, Compose for TV & AndroidX Media3 ExoPlayer.
- `services/`: High-performance Go microservices (`api-gateway`, `auth-service`, `source-resolver`, `media-service`).
- `packages/api-contracts`: OpenAPI 3.1 definitions and JSON schemas.
- `infra/docker`: Docker Compose orchestrating local microservices and databases.
- `docs/`: Architecture specifications, Threat Models, Security rules, and Streaming pipelines.

## Quick Start (Local Backend)
```bash
# Launch Docker infrastructure and microservices
docker compose -f infra/docker/docker-compose.yml up --build -d

# Run Go backend tests
cd services/source-resolver && go test ./...
```

## Android Application Setup
Open `apps/android` in Android Studio or build via Gradle:
```bash
cd apps/android
./gradlew assembleDebug
```
