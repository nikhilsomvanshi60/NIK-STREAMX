# NIK STREAMX — Threat Model

## Threat Analysis & Risk Matrix

| Threat | Risk Level | Mitigation Strategy |
|---|---|---|
| **SSRF via User-Provided Stream URLs** | Critical | Strict IP blacklist checking, DNS resolution validation, non-HTTP scheme blocking, max redirect cap of 3. |
| **Token Theft / Session Hijacking** | High | Short-lived access tokens (15 mins), HTTP-only Secure SameSite cookies for refresh tokens, IP & user-agent binding. |
| **Unauthorized Media Distribution** | High | Short-lived HMAC signed media URLs, token-bound HLS manifest delivery, DRM integration hooks (Widevine/FairPlay). |
| **Brute Force Authentication** | Medium | Redis-backed rate limiting per IP / email on auth routes (5 attempts / min). |
| **Denial of Service (Stream Ingestion Flooding)** | Medium | Stream probe timeout (5s max), payload size restrictions, circuit breaker pattern on upstream connections. |
