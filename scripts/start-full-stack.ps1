# NIK STREAMX — Automated Full Stack Startup Script

Write-Host "============================================================" -ForegroundColor Red
Write-Host " NIK STREAMX -- Starting Backend Microservices and Web App" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Red

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location -Path $ProjectRoot

# 1. Environment & Tool Validation
$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue

if (-not $node -or -not $npm) {
    Write-Host "[ERROR] Node.js and npm environment check failed." -ForegroundColor Red
    exit 1
}

# 2. Build & Launch Web App
$WebAppPath = Join-Path -Path $ProjectRoot -ChildPath "apps\web"
Set-Location -Path $WebAppPath

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing Web dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "[INFO] Running TypeScript typecheck..." -ForegroundColor Yellow
npm run typecheck

# 3. Launch Chrome Preview Profile
$WebUrl = "http://127.0.0.1:5173"
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
    Write-Host "[INFO] Opening Chrome at $WebUrl..." -ForegroundColor Cyan
    Start-Process $chromePath $WebUrl
}

# 4. Start Vite Server
Write-Host "[INFO] Starting Vite dev server..." -ForegroundColor Green
npm run dev
