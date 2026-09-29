# Start Development Servers - Windows PowerShell Script

Write-Host "🚀 Starting Mini Task Manager Development Servers" -ForegroundColor Cyan

# Function to start background process
function Start-BackgroundProcess {
    param($Name, $Path, $Command, $Color)
    
    Write-Host "🔄 Starting $Name..." -ForegroundColor $Color
    
    $job = Start-Job -ScriptBlock {
        param($workingDir, $cmd)
        Set-Location $workingDir
        Invoke-Expression $cmd
    } -ArgumentList $Path, $Command -Name $Name
    
    return $job
}

# Check if MongoDB is running
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "⚠️  MongoDB is not running. Starting MongoDB..." -ForegroundColor Yellow
    Write-Host "   If this fails, please start MongoDB manually:" -ForegroundColor Yellow
    Write-Host "   mongod --dbpath ./data/db" -ForegroundColor Cyan
    
    # Try to start MongoDB (this might fail if not properly configured)
    try {
        Start-Process "mongod" -ArgumentList "--dbpath", "./data/db" -WindowStyle Hidden
        Start-Sleep 3
        Write-Host "✅ MongoDB started" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not start MongoDB automatically. Please start it manually." -ForegroundColor Red
    }
} else {
    Write-Host "✅ MongoDB is already running" -ForegroundColor Green
}

# Start backend server
$backendPath = Join-Path $PWD "backend"
$backendJob = Start-BackgroundProcess "Backend" $backendPath "npm run dev" "Blue"

# Wait a moment for backend to start
Start-Sleep 3

# Start frontend server
$frontendPath = Join-Path $PWD "frontend"
$frontendJob = Start-BackgroundProcess "Frontend" $frontendPath "npm run dev" "Magenta"

Write-Host "`n🎉 Development servers are starting!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "🏥 Health:   http://localhost:5000/api/health" -ForegroundColor Cyan

Write-Host "`n📊 Monitoring jobs. Press Ctrl+C to stop all servers." -ForegroundColor Yellow

# Monitor jobs
try {
    while ($true) {
        $jobs = Get-Job
        $runningJobs = $jobs | Where-Object { $_.State -eq "Running" }
        
        if ($runningJobs.Count -eq 0) {
            Write-Host "❌ All servers have stopped." -ForegroundColor Red
            break
        }
        
        Start-Sleep 5
        
        # Show job status every 30 seconds
        if ((Get-Date).Second % 30 -eq 0) {
            Write-Host "🔄 Status: Backend [$($backendJob.State)] | Frontend [$($frontendJob.State)]" -ForegroundColor Gray
        }
    }
} finally {
    # Cleanup: Stop all jobs when script exits
    Write-Host "`n🛑 Stopping all servers..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "✅ All servers stopped." -ForegroundColor Green
}