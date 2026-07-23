# NIK STREAMX — Verified Repair Baseline Document

## Environment Baseline
- **Timestamp**: 2026-07-23T11:32:16+05:30
- **Target Repository**: `nikhilsomvanshi60/NIK-STREAMX`
- **Working Branch**: `fix/verified-full-system`
- **Authorized Google Drive Test Movie ID**: `1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E`
- **Google Drive Link**: `https://drive.google.com/file/d/1LIUrB58KbbpOBR1goZp2zuKZeQe45f2E/view?usp=drive_link`

## Toolchain Baseline Check
- **Node.js**: v26.3.0
- **npm**: 11.16.0
- **Git**: 2.54.0.windows.1

## Baseline Component Verification Matrix
| Component | Stack / Path | Status | Repair Target |
|---|---|---|---|
| **Web Preview App** | React 18 / TypeScript 5 / Vite (`apps/web`) | Rebuilding | Integrate Tailwind CSS plugin & proxy `/api` |
| **API Gateway** | Go (`services/api-gateway`) | Configured | ServeMux request routing + JSON errors |
| **Source Resolver** | Go (`services/source-resolver`) | Active | Provider abstraction (`SourceProvider`) |
| **Media Service** | Go (`services/media-service`) | Active | Real Range HTTP 206 streaming |
| **Android App** | Kotlin / Compose / Media3 (`apps/android`) | Active | Gradle wrapper & Media3 playback |
| **Automation** | PowerShell Scripts (`scripts/`) | Ready | `start-full-stack.ps1`, `test-full-stack.ps1` |
