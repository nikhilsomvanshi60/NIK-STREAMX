# NIK STREAMX — Platform Compatibility Matrix

| Platform | Framework / Stack | Media Engine | HLS Support | DASH Support | LL-HLS Support | WebRTC | Offline Downloads | Focus / Remote Navigation |
|---|---|---|---|---|---|---|---|---|
| **Android Phone / Tablet** | Kotlin + Jetpack Compose | AndroidX Media3 (ExoPlayer) | Native | Native | Native | Supported | Full (DownloadService) | Touch / Gesture |
| **Android TV / Google TV** | Kotlin + Compose for TV | AndroidX Media3 (ExoPlayer) | Native | Native | Native | Supported | Storage-Permitted | D-Pad Remote Focus Engine |
| **iPhone / iPad** | Swift + SwiftUI | AVFoundation (AVPlayer) | Native | HLS Wrapped | Native | Native | Full (AVAssetDownloadTask) | Touch / Gesture |
| **Apple TV (tvOS)** | Swift + SwiftUI | AVFoundation (AVPlayer) | Native | HLS Wrapped | Native | Unsupported | Unsupported | tvOS Focus Engine |
| **Samsung Tizen TV** | TypeScript + React | Shaka Player / AVPlay | Native / Shaka | Native / Shaka | Supported | Fallback to LL-HLS | Unsupported | D-Pad Key Map |
| **LG webOS TV** | TypeScript + React | Shaka Player / webOS Pipeline | Native / Shaka | Native / Shaka | Supported | Fallback to LL-HLS | Unsupported | D-Pad Key Map / Magic Remote |
| **Web PWA / Desktop Web** | TypeScript + React + Vite | Shaka Player / Video.js | HLS.js / Shaka | Shaka Player | Supported | Native WebRTC | PWA Cache (VOD only) | Mouse / Keyboard |
