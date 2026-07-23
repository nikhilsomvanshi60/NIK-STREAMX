# NIK STREAMX — Full Stack Shutdown Script

Write-Host "[INFO] Stopping NIK STREAMX child processes..." -ForegroundColor Yellow

Get-Process -Name "node", "vite" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "[OK] Shutdown complete." -ForegroundColor Green
