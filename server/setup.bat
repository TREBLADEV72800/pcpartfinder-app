@echo off
REM PCPartFinder Backend Setup Script for Windows
REM Prerequisites: Docker Desktop running, Node.js 22+ installed

echo.
echo ============================================
echo   PCPartFinder - Backend Setup
echo ============================================
echo.

REM Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 22+ from https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js is installed
node --version

REM Check Docker
echo.
echo [2/6] Checking Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    echo Download from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo OK: Docker is running

REM Start Docker services
echo.
echo [3/6] Starting Docker services (PostgreSQL + Redis)...
cd ..
docker-compose up -d
echo OK: Docker services started

REM Wait for PostgreSQL
echo.
echo Waiting for PostgreSQL to be ready...
timeout /t 3 /nobreak >nul
:waitloop
docker exec pcbuilder-db pg_isready -U pcbuilder >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto waitloop
)
echo OK: PostgreSQL is ready

REM Install dependencies
echo.
echo [4/6] Installing dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo OK: Dependencies installed

REM Generate Prisma Client
echo.
echo [5/6] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo OK: Prisma Client generated

REM Run migrations
echo.
echo [6/6] Running database migrations...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo WARNING: Migration failed, trying reset...
    call npx prisma migrate reset --force --skip-seed
)

REM Seed database
echo.
echo Seeding database...
call npm run prisma:seed
echo OK: Database seeded

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Start the server with:
echo   npm run dev
echo.
echo API will be available at:
echo   http://localhost:3001
echo.
pause
