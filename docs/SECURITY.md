# NIK STREAMX — Security Architecture & SSRF Defense

## SSRF (Server-Side Request Forgery) Defense Rules
The `source-resolver` service acts as a security boundary when inspecting user-submitted URLs. It rigorously validates destination endpoints before issuing outgoing HTTP/HTTPS connections.

### Prohibited Destination Ranges:
- Loopback addresses (`127.0.0.0/8`, `::1`)
- IPv4 Private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
- Link-local addresses (`169.254.0.0/16`, `fe80::/10`)
- Cloud Metadata service IPs (`169.254.169.254`, `metadata.google.internal`)
- Non-HTTP/HTTPS protocols (`file://`, `ftp://`, `gopher://`, `data:`, `dict://`)

### DNS Rebinding Defense:
- Resolves hostnames to IP addresses prior to connecting.
- Validates every IP in the resolved record against the disallowed IP subnet rules.
- Re-validates every redirect target (HTTP 301, 302, 307, 308) before following redirects (max 3 redirects).

### Token Isolation & Secrets Management:
- No raw media credentials, OAuth access tokens, or DRM keys are returned directly to client devices.
- Signed short-lived JWT tokens (5-minute expiry) are generated for playback URLs.
