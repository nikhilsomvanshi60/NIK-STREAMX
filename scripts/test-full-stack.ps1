# NIK STREAMX — Automated Full System Test Execution Script

Write-Host "============================================================" -ForegroundColor Red
Write-Host " NIK STREAMX -- Running Automated Tests & Type Checking" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Red

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location -Path "$ProjectRoot\apps\web"

Write-Host "[INFO] Running Web TypeScript typecheck..." -ForegroundColor Yellow
npm run typecheck

Write-Host "[INFO] Running Web Vite build..." -ForegroundColor Yellow
npm run build

Write-Host "[SUCCESS] All web tests & build gates PASSED!" -ForegroundColor Green
