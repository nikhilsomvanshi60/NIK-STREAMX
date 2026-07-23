# NIK STREAMX — Web Dev Environment and Chrome Preview Launcher

Write-Host "============================================================" -ForegroundColor Red
Write-Host " NIK STREAMX -- Launching Web Preview and Local Stack" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Red

# 1. Environment Checks
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[ERROR] Node.js is required to run the web preview application." -ForegroundColor Red
    exit 1
}

$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-Host "[ERROR] npm is required to launch Vite." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Node.js environment detected: $(node -v)" -ForegroundColor Green

# 2. Change Directory to Web App
$webAppPath = Join-Path -Path $PSScriptRoot -ChildPath "..\apps\web"
Set-Location -Path $webAppPath

# 3. Install Web Dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing Web dependencies..." -ForegroundColor Yellow
    npm install
}

# 4. Print URLs
$WebUrl = "http://localhost:5173"
$ApiHealthUrl = "http://localhost:8080/health"

Write-Host ""
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host " Web Preview URL: $WebUrl" -ForegroundColor Green
Write-Host " API Gateway URL: $ApiHealthUrl" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# 5. Open Google Chrome Automatically
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
    Write-Host "[INFO] Opening NIK STREAMX Chrome Preview..." -ForegroundColor Cyan
    Start-Process $chromePath $WebUrl
} else {
    Write-Host "[WARN] Chrome executable not found. Please open $WebUrl manually." -ForegroundColor Yellow
}

# 6. Start Vite Server
npm run dev
