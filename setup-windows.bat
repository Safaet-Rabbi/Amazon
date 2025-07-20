@echo off
echo ========================================
echo   Order Management System Setup
echo   Windows Version
echo ========================================

echo.
echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo.
echo Creating project structure...
mkdir backend
mkdir frontend
mkdir backend\models
mkdir backend\routes
mkdir backend\middleware

echo.
echo Installing root dependencies...
npm init -y
npm install concurrently --save-dev

echo.
echo Setting up backend...
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator
npm install nodemon --save-dev
cd ..

echo.
echo Creating React frontend...
npx create-react-app frontend --template typescript
cd frontend
npm install axios react-router-dom @types/react-router-dom
npm install -D tailwindcss postcss autoprefixer
cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Open project in VS Code: code .
echo 3. Run: npm run dev
echo.
pause