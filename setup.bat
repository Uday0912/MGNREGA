@echo off
echo Setting up MGNREGA Data Visualization Dashboard...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To run the project:
echo 1. Open a new terminal and run: cd backend ^&^& npm start
echo 2. Open another terminal and run: cd frontend ^&^& npm start
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo.
pause

