# Production Build Script - Windows PowerShell

Write-Host "🏗️  Building Mini Task Manager for Production" -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
if (-not (Test-Command "node") -or -not (Test-Command "npm")) {
    Write-Host "❌ Node.js and npm are required for building" -ForegroundColor Red
    exit 1
}

$startTime = Get-Date

# Build backend
Write-Host "`n🔧 Preparing backend for production..." -ForegroundColor Yellow
Set-Location "backend"

Write-Host "📦 Installing production dependencies..." -ForegroundColor Blue
npm ci --only=production

Write-Host "✅ Backend ready for production!" -ForegroundColor Green

# Build frontend
Write-Host "`n🎨 Building frontend..." -ForegroundColor Yellow
Set-Location "../frontend"

# Ensure production environment file exists
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  .env.production not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.development" ".env.production"
    Write-Host "📝 Please update .env.production with production settings" -ForegroundColor Yellow
}

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
npm ci

Write-Host "🏗️  Building frontend for production..." -ForegroundColor Blue
npm run build

if (Test-Path "dist") {
    $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "✅ Frontend build complete! Size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Return to root directory
Set-Location ".."

# Create production deployment info
$buildInfo = @{
    buildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    version = "1.0.0"
    environment = "production"
    nodeVersion = (node --version)
    npmVersion = (npm --version)
} | ConvertTo-Json -Depth 2

$buildInfo | Out-File "build-info.json" -Encoding UTF8

$endTime = Get-Date
$buildDuration = $endTime - $startTime

Write-Host "`n🎉 Production build complete!" -ForegroundColor Green
Write-Host "⏱️  Build time: $($buildDuration.TotalSeconds) seconds" -ForegroundColor Cyan
Write-Host "📁 Frontend build: ./frontend/dist/" -ForegroundColor Cyan
Write-Host "🔧 Backend ready: ./backend/" -ForegroundColor Cyan

Write-Host "`n🚀 Next steps for deployment:" -ForegroundColor Yellow
Write-Host "   1. Deploy backend to your server (Node.js environment)" -ForegroundColor White
Write-Host "   2. Deploy frontend/dist/ to web server (Nginx, Apache, or CDN)" -ForegroundColor White
Write-Host "   3. Update environment variables for production" -ForegroundColor White
Write-Host "   4. Configure MongoDB connection for production" -ForegroundColor White
Write-Host "   5. Set up HTTPS and domain configuration" -ForegroundColor White