# NIK STREAMX — Automated Full System Start & Test Script

Write-Host "============================================================" -ForegroundColor Red
Write-Host " NIK STREAMX -- Full System Start and Chrome Preview" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Red

# 1. Detect Project Root
$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location -Path $ProjectRoot

Write-Host "[INFO] Project Root: $ProjectRoot" -ForegroundColor Green

# 2. Toolchain Validation
$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue

if (-not $node -or -not $npm) {
    Write-Host "[ERROR] Node.js and npm are required." -ForegroundColor Red
    exit 1
}

# 3. Change to Web App and Install/Build
$WebAppPath = Join-Path -Path $ProjectRoot -ChildPath "apps\web"
Set-Location -Path $WebAppPath

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing Web dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "[INFO] Running TypeScript typecheck..." -ForegroundColor Yellow
npm run typecheck

# 4. Open Chrome Preview
$WebUrl = "http://localhost:5173"
$chromePath = Get-Command chrome.exe -ErrorAction SilentlyContinue
if (-not $chromePath) {
    $commonPaths = @(
        "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
    )
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $chromePath = $path
            break
        }
    }
}

if ($chromePath) {
    Write-Host "[INFO] Launching Chrome preview profile at $WebUrl..." -ForegroundColor Cyan
    Start-Process $chromePath $WebUrl
}

# 5. Launch Vite Development Server
Write-Host "[INFO] Starting Vite development server..." -ForegroundColor Green
npm run dev
