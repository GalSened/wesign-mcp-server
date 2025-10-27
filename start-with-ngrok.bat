@echo off
echo ========================================
echo WeSign MCP Server + ngrok
echo For ChatGPT Integration
echo ========================================
echo.

:: Check if ngrok exists
if not exist ngrok.exe (
    echo ERROR: ngrok.exe not found!
    echo Please download ngrok from https://ngrok.com/download
    echo and place ngrok.exe in this folder.
    pause
    exit /b 1
)

:: Start server in background
echo Starting WeSign MCP Server...
start "WeSign MCP Server" cmd /c "call start-chatgpt-server.bat"

:: Wait for server to start
echo Waiting for server to initialize...
timeout /t 5 /nobreak >nul

:: Start ngrok
echo.
echo Starting ngrok tunnel...
echo.
start "ngrok" ngrok.exe http 8080 --log=stdout

:: Wait a moment
timeout /t 3 /nobreak >nul

:: Open ngrok dashboard
echo.
echo Opening ngrok dashboard...
start http://localhost:4040

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo 1. Check ngrok dashboard for your public URL
echo 2. Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
echo 3. Add /mcp to the end (e.g., https://abc123.ngrok-free.app/mcp)
echo 4. Use this URL in ChatGPT Settings -^> Connectors
echo.
echo Press any key to view setup instructions...
pause >nul

start CHATGPT_VISUAL_SETUP.md

echo.
echo Both server and ngrok are running!
echo Press Ctrl+C in each window to stop.
echo.
