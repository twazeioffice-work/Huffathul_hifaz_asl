Write-Host "Initiating HARD RESTART of Suffat-ul Huffaz Next.js Enterprise Server..." -ForegroundColor Cyan

# 1. Gracefully terminate existing Node.js instances
Write-Host "[1/3] Terminating ghosted/background node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# 2. Clear .next cache just in case
Write-Host "[2/3] Cleaning up cache..." -ForegroundColor Yellow
if (Test-Path -Path "apps/internal-erp/.next") {
    Remove-Item -Path "apps/internal-erp/.next" -Recurse -Force
}

# 3. Trigger fresh production build
Write-Host "[3/3] Recompiling Edge Routes and Asset Tree..." -ForegroundColor Cyan
npm run build

Write-Host "=============================================" -ForegroundColor Green
Write-Host "Server successfully rebuilt and cache purged!" -ForegroundColor Green
Write-Host "Please run 'npm run start' or 'npm run dev' to boot the fresh UI." -ForegroundColor White
