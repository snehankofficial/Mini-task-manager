# Development Scripts for Windows PowerShell
# Run these commands to set up and start the development environment

Write-Host "🚀 Mini Task Manager - Development Setup" -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js and npm are installed" -ForegroundColor Green

# Check for MongoDB
if (-not (Test-Command "mongod")) {
    Write-Host "⚠️  MongoDB is not installed or not in PATH. Please install MongoDB Community Edition" -ForegroundColor Yellow
    Write-Host "   Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

# Setup backend
Write-Host "`n🔧 Setting up backend..." -ForegroundColor Yellow
Set-Location "backend"

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "📄 Created .env file from .env.example" -ForegroundColor Green
    Write-Host "⚠️  Please update the .env file with your configuration" -ForegroundColor Yellow
}

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
npm install

Write-Host "✅ Backend setup complete!" -ForegroundColor Green

# Setup frontend
Write-Host "`n🎨 Setting up frontend..." -ForegroundColor Yellow
Set-Location "../frontend"

if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.development" ".env.local"
    Write-Host "📄 Created .env.local file from .env.development" -ForegroundColor Green
}

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
npm install

Write-Host "✅ Frontend setup complete!" -ForegroundColor Green

# Return to root directory
Set-Location ".."

Write-Host "`n🎉 Setup complete! Now you can run:" -ForegroundColor Green
Write-Host "   npm run dev        - Start both frontend and backend" -ForegroundColor Cyan
Write-Host "   npm run dev:backend - Start only backend server" -ForegroundColor Cyan
Write-Host "   npm run dev:frontend- Start only frontend server" -ForegroundColor Cyan
Write-Host "`n🔗 Application URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   API Health: http://localhost:5000/api/health" -ForegroundColor Cyan