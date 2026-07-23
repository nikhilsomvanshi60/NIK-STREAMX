# NIK STREAMX — GitHub Source Verification Audit Script

Write-Host "============================================================" -ForegroundColor Red
Write-Host " NIK STREAMX -- Auditing Repository Content before GitHub Upload" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Red

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location -Path $ProjectRoot

# Required directories & files check
$requiredItems = @(
    "apps/web",
    "apps/android",
    "services/source-resolver",
    "services/auth-service",
    "services/media-service",
    "services/api-gateway",
    "packages/api-contracts",
    "infra/docker",
    "docs",
    "scripts",
    ".github/workflows",
    "README.md",
    ".env.example"
)

$missingItems = @()
foreach ($item in $requiredItems) {
    if (-not (Test-Path $item)) {
        $missingItems += $item
    }
}

if ($missingItems.Count -gt 0) {
    Write-Host "[ERROR] Missing required project components for GitHub upload:" -ForegroundColor Red
    foreach ($m in $missingItems) {
        Write-Host " - $m" -ForegroundColor Red
    }
    exit 1
}

# Count tracked source files
$trackedFiles = git ls-files
$fileCount = ($trackedFiles | Measure-Object).Count

Write-Host "[OK] Total tracked source files in Git: $fileCount" -ForegroundColor Green

if ($fileCount -lt 30) {
    Write-Host "[ERROR] Repository contains too few source files ($fileCount < 30). Upload rejected." -ForegroundColor Red
    exit 1
}

Write-Host "[SUCCESS] Monorepo verification PASSED! Ready for GitHub push." -ForegroundColor Green
